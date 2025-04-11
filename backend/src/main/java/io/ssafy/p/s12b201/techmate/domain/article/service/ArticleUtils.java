package io.ssafy.p.s12b201.techmate.domain.article.service;

import io.ssafy.p.s12b201.techmate.domain.article.domain.Article;
import io.ssafy.p.s12b201.techmate.domain.article.presentation.dto.response.ArticleCardResponse;
import io.ssafy.p.s12b201.techmate.domain.article.presentation.dto.response.ArticleDetailResponse;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Slice;

import java.util.List;

public interface ArticleUtils {

    Article getArticleById(Long articleId);

    List<Article> getArticlesByArticleIds(List<Long> articleIds);

    // 추천 기사 조회 메서드
    Slice<ArticleCardResponse> getRecommendArticles(PageRequest pageRequest);

    // 최신순 기사 조회 메서드
    Slice<ArticleCardResponse> getRecentArticles(PageRequest pageRequest);

    // 인기순 기사 조회 메서드
    Slice<ArticleCardResponse> getHotArticles(PageRequest pageRequest);

    // 카테고리 별 기사 조회 메서드
    Slice<ArticleCardResponse> getArticlesByCategory(String category, PageRequest pageRequest);

    // 기사 상세
    ArticleDetailResponse getArticleDetail(Long articleId);

    // 기사 검색
    Slice<ArticleCardResponse> searchArticles(String keyword, PageRequest pageRequest);
}
