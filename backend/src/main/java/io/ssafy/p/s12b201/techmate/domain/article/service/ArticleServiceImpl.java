package io.ssafy.p.s12b201.techmate.domain.article.service;

import io.ssafy.p.s12b201.techmate.domain.article.domain.Article;
import io.ssafy.p.s12b201.techmate.domain.article.domain.repository.ArticleRepository;
import io.ssafy.p.s12b201.techmate.domain.article.exception.ArticleNotFoundException;
import io.ssafy.p.s12b201.techmate.global.exception.UserNotFoundException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

@Slf4j
@RequiredArgsConstructor
@Service
public class ArticleServiceImpl implements ArticleUtils {

    private final ArticleRepository articleRepository;

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

        return article;
    }
}
