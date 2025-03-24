package io.ssafy.p.s12b201.techmate.domain.article.presentation.dto.response;

import io.ssafy.p.s12b201.techmate.domain.article.domain.Article;
import lombok.Builder;
import lombok.Getter;

import java.time.LocalDateTime;

@Getter
@Builder
public class ArticleCardResponse {

    private Long articleId;
    private String title;
    private String journal;
    private String summary;
    private String thumbnailImageUrl;
    private LocalDateTime datetime;
    private String category;

    public static ArticleCardResponse from(Article article) {

        // images 리스트에서 첫 번째 이미지의 URL만 가져오기
        String thumbnailImageUrl = null;
        if (article.getImages() != null && !article.getImages().isEmpty()) {
            thumbnailImageUrl = article.getImages().get(0).getImageUrl();
        }

        return ArticleCardResponse.builder()
                .articleId(article.getArticleId())
                .title(article.getTitle())
                .journal(article.getJournal())
                .summary(article.getSummary())
                .thumbnailImageUrl(thumbnailImageUrl)
                .datetime(article.getDatetime())
                .category(article.getCategory())
                .build();
    }
}
