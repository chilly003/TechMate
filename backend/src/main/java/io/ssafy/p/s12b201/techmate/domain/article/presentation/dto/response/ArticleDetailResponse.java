package io.ssafy.p.s12b201.techmate.domain.article.presentation.dto.response;

import io.ssafy.p.s12b201.techmate.domain.article.domain.Article;
import lombok.Builder;
import lombok.Getter;

import java.time.LocalDateTime;
import java.util.List;

@Getter
@Builder
public class ArticleDetailResponse {

    private Long articleId;
    private String title;
    private String journal;
    private String summary;
    private String reporter;
    private String datetime;
    private String category;
    private String content;
    private List<ImageDto> images;
    private Boolean quizGenerated;
    private List<QuizDto> quizzes;
    private List<ArticleCardResponse> similarArticles;
    private boolean isLiked;
    private boolean isScraped;
    private Long scrapId;

    public static ArticleDetailResponse from(Article article, List<ArticleCardResponse> similarArticles,
                                             boolean isLLiked,
                                             boolean isScraped,
                                             Long scrapId) {
        return ArticleDetailResponse.builder()
                .articleId(article.getArticleId())
                .title(article.getTitle())
                .journal(article.getJournal())
                .summary(article.getSummary())
                .reporter(article.getReporter())
                .datetime(article.getDatetime())
                .category(article.getCategory())
                .content(article.getContent())
                .images(article.getImages())
                .quizGenerated(article.getQuizGenerated())
                .quizzes(article.getQuizzes())
                .similarArticles(similarArticles)
                .isLiked(isLLiked)
                .isScraped(isScraped)
                .scrapId(scrapId)
                .build();
    }
}
