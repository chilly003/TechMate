package io.ssafy.p.s12b201.techmate.domain.userpreference.service;

import io.ssafy.p.s12b201.techmate.domain.user.domain.User;
import io.ssafy.p.s12b201.techmate.domain.userpreference.presentation.dto.request.ArticleInitRequest;
import io.ssafy.p.s12b201.techmate.domain.article.presentation.dto.response.ArticleCardResponse;

import java.util.List;

public interface UserPreferenceService {

    // 랜덤 기사 조회 메서드
    List<ArticleCardResponse> getRandomArticles();

    // 랜덤 기사 등록 메서드
    void initializeArticles(ArticleInitRequest articleInitRequest);

    void createArticles(ArticleInitRequest articleInitRequest, User user);
}
