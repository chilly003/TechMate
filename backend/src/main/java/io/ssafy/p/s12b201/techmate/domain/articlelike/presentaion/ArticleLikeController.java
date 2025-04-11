package io.ssafy.p.s12b201.techmate.domain.articlelike.presentaion;

import io.ssafy.p.s12b201.techmate.domain.articlelike.service.ArticleLikeService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RequestMapping("/api/v1/article-like")
@RequiredArgsConstructor
@RestController
@Slf4j
public class ArticleLikeController {

    private final ArticleLikeService articleLikeService;

    // 뉴스카드 좋아요
    @PostMapping("/{articleId}")
    public void likeArticle(@PathVariable Long articleId) {
        articleLikeService.likeArticle(articleId);
    }
}
