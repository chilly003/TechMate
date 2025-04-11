package io.ssafy.p.s12b201.techmate.domain.article.domain;

import io.ssafy.p.s12b201.techmate.domain.article.presentation.dto.response.ImageDto;
import io.ssafy.p.s12b201.techmate.domain.article.presentation.dto.response.KeywordDto;
import io.ssafy.p.s12b201.techmate.domain.article.presentation.dto.response.QuizDto;
import org.springframework.data.annotation.Id;
import lombok.Data;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.Field;
import java.time.LocalDateTime;
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
    private String datetime;

    private String category;
    private String content;
    private List<ImageDto> images;

    @Field("quiz_generated")
    private Boolean quizGenerated;

    @Field("quizzes")
    private List<QuizDto> quizzes;
    private String correctness;
    private List<KeywordDto> keywords;

    public void insertQuiz(List<QuizDto> quiz) {
        quizzes = quiz;
        quizGenerated = true;
        correctness = "default";
    }

}