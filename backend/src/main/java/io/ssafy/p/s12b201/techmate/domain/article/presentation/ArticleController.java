package io.ssafy.p.s12b201.techmate.domain.article.presentation;

import io.ssafy.p.s12b201.techmate.domain.article.presentation.dto.requset.ArticleInitRequest;
import io.ssafy.p.s12b201.techmate.domain.article.presentation.dto.response.ArticleCardResponse;

import io.ssafy.p.s12b201.techmate.domain.article.service.ArticleUtils;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RequestMapping("/api/v1/articles")
@RequiredArgsConstructor
@RestController
public class ArticleController {

    private final ArticleUtils articleUtils;

    // 선호 기사 조회 (콜드 스타트 시 사용)
    @GetMapping("/random")
    public List<ArticleCardResponse> getRandomArticles() {
        return articleUtils.getRandomArticles();
    }

    // 선호 기사 등록 (콜드 스타트 시 사용)
    @PostMapping("/random")
    public void initializeArticles(@RequestBody ArticleInitRequest request) {
        articleUtils.initializeArticles(request);
    }

//    @GetMapping("/{id}")
//    private void test(@PathVariable Long id) {
//        Article articleById = articleUtils.getArticleById(id);
//    }
}
