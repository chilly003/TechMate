package io.ssafy.p.s12b201.techmate.domain.article.domain;

import jakarta.persistence.Id;
import lombok.Data;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.Field;

import java.util.List;

@Document(collection = "recommendation")
@Data
public class Recommendation {

    @Id
    private String id;

    @Indexed
    @Field("user_id")
    private Long userId;

    @Field("articles")
    private List<Long> articleIDs;

}
