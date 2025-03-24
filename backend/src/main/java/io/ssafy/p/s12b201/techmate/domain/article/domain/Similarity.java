package io.ssafy.p.s12b201.techmate.domain.article.domain;

import jakarta.persistence.Id;
import lombok.Data;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.Field;

import java.util.List;

@Document(collection = "similarity")
@Data
public class Similarity {

    @Id
    private String id;

    @Indexed
    @Field("article_id")
    private Long articleId;

    @Field("similar_articles")
    private List<SimilarArticle> similarArticles;

    @Data
    static class SimilarArticle {
        @Field("article_id")
        private Long articleId;

        @Field("similarity_score")
        private Double similarityScore;
    }
}