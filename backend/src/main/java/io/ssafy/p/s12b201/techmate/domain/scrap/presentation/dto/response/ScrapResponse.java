package io.ssafy.p.s12b201.techmate.domain.scrap.presentation.dto.response;

import io.ssafy.p.s12b201.techmate.domain.article.domain.Article;
import io.ssafy.p.s12b201.techmate.domain.article.presentation.dto.response.ImageDto;
import io.ssafy.p.s12b201.techmate.domain.scrap.domain.Scrap;
import lombok.Getter;
import org.springframework.data.mongodb.core.mapping.Field;

import java.time.LocalDateTime;
import java.util.List;

@Getter
public class ScrapResponse {

    private Long scrapId;
    private Long memoId;

    private Long articleId;
    private String title;
    private String journal;
    private String summary;

    private String datetime;
    private String category;
    private List<ImageDto> images;
    private LocalDateTime createdAt;
    private LocalDateTime lastModifiedAt;

    public ScrapResponse(Scrap scrap, Article article) {

        scrapId = scrap.getId();
        articleId = scrap.getArticleId();
        memoId = scrap.getMemo().getId();
        title = article.getTitle();
        journal = article.getJournal();
        summary = article.getSummary();
        datetime = article.getDatetime();
        category = article.getCategory();
        images = article.getImages();
        createdAt = scrap.getCreatedAt();
        lastModifiedAt = scrap.getLastModifiedAt();
    }

}
