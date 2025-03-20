package io.ssafy.p.s12b201.techmate.domain.article.presentation;

import io.ssafy.p.s12b201.techmate.domain.article.domain.Article;
import io.ssafy.p.s12b201.techmate.domain.article.service.ArticleUtils;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RequestMapping("/api/v1/articles")
@RequiredArgsConstructor
@RestController
public class ArticleController {

    private final ArticleUtils articleUtils;

    @GetMapping("/{id}")
    private void test(@PathVariable Long id) {
        Article articleById = articleUtils.getArticleById(id);
    }
}
