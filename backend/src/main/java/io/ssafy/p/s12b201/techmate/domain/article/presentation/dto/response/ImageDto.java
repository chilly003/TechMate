package io.ssafy.p.s12b201.techmate.domain.article.presentation.dto.response;

import lombok.Getter;
import org.springframework.data.mongodb.core.mapping.Field;


@Getter
public class ImageDto {
    @Field("image_url")
    private String imageUrl;

    @Field("image_desc")
    private String imageDesc;
}