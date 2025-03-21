package io.ssafy.p.s12b201.techmate.domain.article.presentation;

import io.ssafy.p.s12b201.techmate.domain.article.presentation.dto.requset.ArticleInitRequest;
import io.ssafy.p.s12b201.techmate.domain.article.presentation.dto.response.RandomArticleResponse;
import io.ssafy.p.s12b201.techmate.domain.article.service.ArticleUtils;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RequestMapping("/api/v1/articles")
@RequiredArgsConstructor
@RestController
public class ArticleController {

    private final ArticleUtils articleUtils;

    // 선호 기사 등록 (콜드 스타트 시 사용)
    @GetMapping("/random")
    public List<RandomArticleResponse> getRandomArticles() {
        return articleUtils.getRandomArticles().stream().map(RandomArticleResponse::from).toList();
    }


    @PostMapping("/random")
    public void initializeArticles(@RequestBody ArticleInitRequest request) {
        articleUtils.initializeArticles(request);
    }

//    @GetMapping("/{id}")
//    private void test(@PathVariable Long id) {
//        Article articleById = articleUtils.getArticleById(id);
//    }
}
