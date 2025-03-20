package io.ssafy.p.s12b201.techmate.domain.article.service;

import io.ssafy.p.s12b201.techmate.domain.article.domain.Article;
import io.ssafy.p.s12b201.techmate.domain.article.presentation.dto.requset.ArticleInitRequest;

import java.util.List;

public interface ArticleUtils {

    Article getArticleById(Long articleId);

    void initializeArticles(ArticleInitRequest articleInitRequest);

    List<Article> getArticlesByArticleIds(List<Long> articleIds);
}
