package io.ssafy.p.s12b201.techmate.domain.article.service;

import io.ssafy.p.s12b201.techmate.domain.article.domain.Article;
import io.ssafy.p.s12b201.techmate.domain.article.presentation.dto.requset.ArticleInitRequest;
import io.ssafy.p.s12b201.techmate.domain.article.presentation.dto.response.ArticleCardResponse;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Slice;

import java.util.List;

public interface ArticleUtils {

    Article getArticleById(Long articleId);

    void initializeArticles(ArticleInitRequest articleInitRequest);

    List<Article> getArticlesByArticleIds(List<Long> articleIds);

    // 랜덤 기사 조회 메서드
    List<ArticleCardResponse> getRandomArticles();

    // 추천 기사 조회 메서드
    Slice<ArticleCardResponse> getRecommendArticles(PageRequest pageRequest);

    // 카테고리 별 기사 조회 메서드
    Slice<ArticleCardResponse> getArticlesByCategory(String category, PageRequest pageRequest);
}
