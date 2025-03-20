package io.ssafy.p.s12b201.techmate.domain.article.domain;

import io.ssafy.p.s12b201.techmate.domain.article.presentation.dto.response.ImageDto;
import io.ssafy.p.s12b201.techmate.domain.article.presentation.dto.response.KeywordDto;
import jakarta.persistence.PostLoad;
import org.springframework.data.annotation.Id;
import lombok.Data;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.Field;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;

@Document(collection = "articles")
@Data
public class Article {

    @Id
    private String id;

    @Indexed
    @Field("article_id")
    private Long articleId;

    private String title;
    private String journal;
    private String summary;
    private String reporter;

    @Field("datetime")
    private LocalDateTime datetime;

    private String category;
    private String content;
    private List<ImageDto> images;

    @Field("quiz_generated")
    private Boolean quizGenerated;

    private List<Object> quizzes;
    private String correctness;
    private List<KeywordDto> keywords;

}