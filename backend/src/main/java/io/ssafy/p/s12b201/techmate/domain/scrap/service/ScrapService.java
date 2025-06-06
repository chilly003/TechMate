package io.ssafy.p.s12b201.techmate.domain.scrap.service;

import io.ssafy.p.s12b201.techmate.domain.article.domain.Article;
import io.ssafy.p.s12b201.techmate.domain.article.exception.ArticleNotFoundException;
import io.ssafy.p.s12b201.techmate.domain.article.service.ArticleUtils;
import io.ssafy.p.s12b201.techmate.domain.scrap.domain.Folder;
import io.ssafy.p.s12b201.techmate.domain.scrap.domain.Memo;
import io.ssafy.p.s12b201.techmate.domain.scrap.domain.Scrap;
import io.ssafy.p.s12b201.techmate.domain.scrap.domain.repository.FolderRepository;
import io.ssafy.p.s12b201.techmate.domain.scrap.domain.repository.MemoRepository;
import io.ssafy.p.s12b201.techmate.domain.scrap.domain.repository.ScrapRepository;
import io.ssafy.p.s12b201.techmate.domain.scrap.excepcion.*;
import io.ssafy.p.s12b201.techmate.domain.scrap.presentation.dto.request.CreateFolderRequest;
import io.ssafy.p.s12b201.techmate.domain.scrap.presentation.dto.request.UpdateFolderRequest;
import io.ssafy.p.s12b201.techmate.domain.scrap.presentation.dto.request.UpdateMemoRequest;
import io.ssafy.p.s12b201.techmate.domain.scrap.presentation.dto.response.FolderResponse;
import io.ssafy.p.s12b201.techmate.domain.scrap.presentation.dto.response.MemoResponse;
import io.ssafy.p.s12b201.techmate.domain.scrap.presentation.dto.response.ScrapResponse;
import io.ssafy.p.s12b201.techmate.domain.user.domain.User;
import io.ssafy.p.s12b201.techmate.global.utils.security.SecurityUtils;
import io.ssafy.p.s12b201.techmate.global.utils.user.UserUtils;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Slice;
import org.springframework.data.domain.SliceImpl;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Slf4j
@RequiredArgsConstructor
@Service
public class ScrapService {

    private final FolderRepository folderRepository;
    private final MemoRepository memoRepository;
    private final ScrapRepository scrapRepository;
    private final ArticleUtils articleUtils;
    private final UserUtils userUtils;

    @Transactional
    public ScrapResponse createScrap(Long articleId, Long folderId) {

        Article article = articleUtils.getArticleById(articleId);

        User user = userUtils.getUserFromSecurityContext();

        Folder folder = queryFolder(folderId);

        folder.validUserIsHost(user.getId());

        if (scrapRepository.existsByArticleIdAndUser(articleId,user)){
            throw ScrapAlreadyExistsException.EXCEPTION;
        }

        Memo memo = makeMemo(user);

        memoRepository.save(memo);

        Scrap scrap = makeScrap(user, folder, memo, articleId);

        scrapRepository.save(scrap);

        return getScrap(scrap, article);

    }

    @Transactional
    public void deleteScrap(Long scrapId) {

        Long currentUserId = SecurityUtils.getCurrentUserId();

        Scrap scrap = queryScrap(scrapId);

        scrap.validUserIsHost(currentUserId);

        scrapRepository.delete(scrap);
    }

    @Transactional(readOnly = true)
    public Slice<ScrapResponse> findAllScrap(Long folderId, PageRequest pageRequest) {
        Long currentUserId = SecurityUtils.getCurrentUserId();

        Folder folder = queryFolder(folderId);
        folder.validUserIsHost(currentUserId);

        Slice<Scrap> scraps = scrapRepository.findAllByFolder(folder, pageRequest);

        List<Long> articleIds = scraps.getContent().stream()
                .map(Scrap::getArticleId)
                .collect(Collectors.toList());

        List<Article> articles = articleUtils.getArticlesByArticleIds(articleIds);
        Map<Long, Article> articleMap = articles.stream()
                .collect(Collectors.toMap(Article::getArticleId, article -> article));

        List<ScrapResponse> scrapResponses = scraps.getContent().stream()
                .map(scrap -> {
                    Article article = articleMap.get(scrap.getArticleId());
                    if (article == null) {
                        throw ArticleNotFoundException.EXCEPTION;
                    }
                    return getScrap(scrap, article);
                })
                .collect(Collectors.toList());

        return new SliceImpl<>(scrapResponses, pageRequest, scraps.hasNext());
    }

    @Transactional(readOnly = true)
    public MemoResponse findMemo(Long articleId) {

        User user = userUtils.getUserFromSecurityContext();

        Scrap scrap = scrapRepository.findByArticleIdAndUser(articleId,user)
                .orElseThrow(() -> ScrapNotFoundException.EXCEPTION);

        scrap.validUserIsHost(user.getId());

        return getMemo(scrap);
    }

    @Transactional
    public MemoResponse updateMemo(Long memoId, UpdateMemoRequest updateMemoRequest) {

        Long currentUserId = SecurityUtils.getCurrentUserId();

        Memo memo = queryMemo(memoId);

        memo.validUserIsHost(currentUserId);

        memo.updateMemo(updateMemoRequest.getContent());

        Scrap scrap = queryScrap(memo.getScrap().getId());

        return getMemo(scrap);
    }

    @Transactional
    public FolderResponse createFolder(CreateFolderRequest createEssayRequest){

        User user = userUtils.getUserFromSecurityContext();

        if (folderRepository.existsByFolderNameAndUser(createEssayRequest.getFolderName(),user)) {
            throw FolderNameAlreadyExistsException.EXCEPTION;
        }

        Folder folder = makeFolder(createEssayRequest, user);
        folderRepository.save(folder);

        return getFolder(folder);
    }


    @Transactional
    public void deleteFolder(Long folderId){

        User user = userUtils.getUserFromSecurityContext();

        Folder folder = queryFolder(folderId);

        folder.validUserIsHost(user.getId());

        folderRepository.delete(folder);
    }

    @Transactional
    public FolderResponse updateFolder(Long folderId, UpdateFolderRequest updateFolderRequest) {

        User user = userUtils.getUserFromSecurityContext();

        Folder folder = queryFolder(folderId);

        folder.validUserIsHost(user.getId());

        if (folderRepository.existsByFolderNameAndUser(updateFolderRequest.getFolderName(),user)) {
            throw FolderNameAlreadyExistsException.EXCEPTION;
        }

        folder.updateFolder(updateFolderRequest.getFolderName());

        return getFolder(folder);
    }

    public Slice<FolderResponse> findAllFolder(PageRequest pageRequest) {

        Long currentUserId = SecurityUtils.getCurrentUserId();

        Slice<Folder> folders = folderRepository.findAllUserFolder(currentUserId, pageRequest);

        return folders.map(this::getFolder);
    }



    private Folder makeFolder(CreateFolderRequest createFolderRequest, User user){

        return Folder.builder()
                .user(user)
                .folderName(createFolderRequest.getFolderName())
                .build();
    }

    private Scrap makeScrap(User user, Folder folder, Memo memo, Long articleId) {

        Scrap scrap = Scrap.builder()
                .user(user)
                .folder(folder)
                .memo(memo)
                .articleId(articleId)
                .build();

        memo.addScrap(scrap);
        return scrap;
    }

    private Memo makeMemo(User user) {
        return Memo.builder()
                .user(user)
                .content("")
                .build();
    }


    private Folder queryFolder(Long folderId){
        return folderRepository
                .findById(folderId)
                .orElseThrow(() -> FolderNotFoundException.EXCEPTION);
    }

    private Scrap queryScrap(Long scrapId){
        return scrapRepository
                .findById(scrapId)
                .orElseThrow(() -> ScrapNotFoundException.EXCEPTION);
    }

    private Memo queryMemo(Long memoId){
        return memoRepository
                .findById(memoId)
                .orElseThrow(() -> MemoNotFoundException.EXCEPTION);
    }

    private FolderResponse getFolder(Folder folder){
        return new FolderResponse(folder);
    }

    private ScrapResponse getScrap(Scrap scrap, Article article){
        return new ScrapResponse(scrap, article);
    }

    private MemoResponse getMemo(Scrap scrap){
        return new MemoResponse(scrap);
    }

}
