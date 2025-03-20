package io.ssafy.p.s12b201.techmate.domain.article.service;

import io.ssafy.p.s12b201.techmate.domain.article.domain.Article;
import io.ssafy.p.s12b201.techmate.domain.article.domain.repository.ArticleRepository;
import io.ssafy.p.s12b201.techmate.domain.article.exception.ArticleNotFoundException;
import io.ssafy.p.s12b201.techmate.domain.article.presentation.dto.requset.ArticleInitRequest;
import io.ssafy.p.s12b201.techmate.domain.user.domain.User;
import io.ssafy.p.s12b201.techmate.domain.user.domain.repository.UserRepository;
import io.ssafy.p.s12b201.techmate.domain.userpreference.domain.UserPreference;
import io.ssafy.p.s12b201.techmate.domain.userpreference.domain.repository.UserPreferenceRepository;
import io.ssafy.p.s12b201.techmate.global.exception.UserNotFoundException;
import io.ssafy.p.s12b201.techmate.global.utils.user.UserUtils;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Slf4j
@RequiredArgsConstructor
@Service
public class ArticleServiceImpl implements ArticleUtils {

    private final ArticleRepository articleRepository;
    private final UserRepository userRepository;
    private final UserPreferenceRepository userPreferenceRepository;
    private final UserUtils userUtils;

    @Override
    public Article getArticleById(Long articleId) {
        Article article = articleRepository
                .findByArticleId(articleId).orElseThrow(() -> ArticleNotFoundException.EXCEPTION);

        /*
        // todo 추후 로그 삭제
         */
        log.info("getArticleById articleId={}", article.getArticleId());
        log.info("article content={}", article.getContent());
        log.info("article title={}", article.getTitle());
        log.info("article category={}", article.getCategory());
        log.info("dateTime={}", article.getDatetime().getClass());
        log.info("dateTime={}", article.getDatetime());

        return article;
    }

    @Override
    @Transactional
    public void initializeArticles(ArticleInitRequest articleInitRequest) {

        // 사용자 검증
        User user = userUtils.getUserFromSecurityContext();
        userRepository.findById(user.getId())
                .orElseThrow(() -> UserNotFoundException.EXCEPTION);

        // 요청으로 받은 기사 ID마다 UserPreference를 생성
        List<UserPreference> preferences = new ArrayList<>();
        for (Long articleId : articleInitRequest.getArticle_id()) {
            UserPreference preference = UserPreference.builder()
                    .user(user)
                    .articleId(articleId)
                    .build();

            preferences.add(preference);
        }

        // 선호하는 모든 기사 저장
        userPreferenceRepository.saveAll(preferences);
    }
}
