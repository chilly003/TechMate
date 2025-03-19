package io.ssafy.p.s12b201.techmate.domain.scrap.service;

import io.ssafy.p.s12b201.techmate.domain.scrap.domain.Folder;
import io.ssafy.p.s12b201.techmate.domain.scrap.domain.repository.FolderRepository;
import io.ssafy.p.s12b201.techmate.domain.scrap.excepcion.FolderNameAlreadyExistsException;
import io.ssafy.p.s12b201.techmate.domain.scrap.excepcion.FolderNotFolderException;
import io.ssafy.p.s12b201.techmate.domain.scrap.presentation.dto.request.CreateFolderRequest;
import io.ssafy.p.s12b201.techmate.domain.scrap.presentation.dto.request.UpdateFolderRequest;
import io.ssafy.p.s12b201.techmate.domain.scrap.presentation.dto.response.FolderResponse;
import io.ssafy.p.s12b201.techmate.domain.user.domain.User;
import io.ssafy.p.s12b201.techmate.global.utils.security.SecurityUtils;
import io.ssafy.p.s12b201.techmate.global.utils.user.UserUtils;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Slice;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.FormatFlagsConversionMismatchException;

@Slf4j
@RequiredArgsConstructor
@Service
public class ScrapService {

    private final FolderRepository folderRepository;
    private final UserUtils userUtils;

    @Transactional
    public FolderResponse createFolder(CreateFolderRequest createEssayRequest){

        User user = userUtils.getUserFromSecurityContext();

        if (folderRepository.existsByFolderName(createEssayRequest.getFolderName())) {
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

        Long currentUserId = SecurityUtils.getCurrentUserId();

        Folder folder = queryFolder(folderId);

        folder.validUserIsHost(currentUserId);

        if (folderRepository.existsByFolderName(updateFolderRequest.getFolderName())) {
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

    private Folder queryFolder(Long folderId){
        return folderRepository
                .findById(folderId)
                .orElseThrow(() -> FolderNotFolderException.EXCEPTION);
    }

    private FolderResponse getFolder(Folder folder){
        return new FolderResponse(folder);
    }

}
