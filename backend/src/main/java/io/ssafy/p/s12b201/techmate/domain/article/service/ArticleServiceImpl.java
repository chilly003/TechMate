package io.ssafy.p.s12b201.techmate.domain.article.service;

import io.ssafy.p.s12b201.techmate.domain.article.domain.Article;
import io.ssafy.p.s12b201.techmate.domain.article.domain.Recommendation;
import io.ssafy.p.s12b201.techmate.domain.article.domain.repository.ArticleRepository;
import io.ssafy.p.s12b201.techmate.domain.article.exception.ArticleNotFoundException;
import io.ssafy.p.s12b201.techmate.domain.article.presentation.dto.requset.ArticleInitRequest;
import io.ssafy.p.s12b201.techmate.domain.article.presentation.dto.response.ArticleCardResponse;
import io.ssafy.p.s12b201.techmate.domain.article.presentation.dto.response.ArticleDetailResponse;
import io.ssafy.p.s12b201.techmate.domain.articlelike.domain.ArticleLike;
import io.ssafy.p.s12b201.techmate.domain.articlelike.domain.repository.ArticleLikeRepository;
import io.ssafy.p.s12b201.techmate.domain.user.domain.User;
import io.ssafy.p.s12b201.techmate.domain.user.domain.repository.UserRepository;
import io.ssafy.p.s12b201.techmate.domain.userpreference.domain.UserPreference;
import io.ssafy.p.s12b201.techmate.domain.userpreference.domain.repository.UserPreferenceRepository;
import io.ssafy.p.s12b201.techmate.global.exception.UserNotFoundException;
import io.ssafy.p.s12b201.techmate.global.utils.user.UserUtils;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.bson.Document;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Slice;
import org.springframework.data.domain.SliceImpl;
import org.springframework.data.domain.Sort;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.aggregation.Aggregation;
import org.springframework.data.mongodb.core.aggregation.AggregationOperation;
import org.springframework.data.mongodb.core.aggregation.AggregationResults;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.*;
import java.util.stream.Collectors;

@Slf4j
@RequiredArgsConstructor
@Service
public class ArticleServiceImpl implements ArticleUtils {

    private final ArticleRepository articleRepository;
    private final UserRepository userRepository;
    private final UserPreferenceRepository userPreferenceRepository;
    private final UserUtils userUtils;
    private final MongoTemplate mongoTemplate;
    private final ArticleLikeRepository articleLikeRepository;

    @Override
    public Article getArticleById(Long articleId) {
        Article article = articleRepository
                .findByArticleId(articleId).orElseThrow(() -> ArticleNotFoundException.EXCEPTION);

        /*
        // todo 추후 로그 삭제
         */
        log.info("getArticleById articleId={}", article.getArticleId());
        log.info("article content={}", article.getContent());
        log.info("article title={}", article.getTitle());
        log.info("article category={}", article.getCategory());
        log.info("dateTime={}", article.getDatetime().getClass());
        log.info("dateTime={}", article.getDatetime());

        return article;
    }

    @Override
    @Transactional
    public void initializeArticles(ArticleInitRequest articleInitRequest) {

        // 사용자 검증
        User user = userUtils.getUserFromSecurityContext();
        userRepository.findById(user.getId())
                .orElseThrow(() -> UserNotFoundException.EXCEPTION);

        // 요청으로 받은 기사 ID마다 UserPreference를 생성
        List<UserPreference> preferences = new ArrayList<>();
        for (Long articleId : articleInitRequest.getArticle_id()) {
            UserPreference preference = UserPreference.builder()
                    .user(user)
                    .articleId(articleId)
                    .build();

            preferences.add(preference);
        }

        // 선호하는 모든 기사 저장
        userPreferenceRepository.saveAll(preferences);
    }

    @Override
    public List<Article> getArticlesByArticleIds(List<Long> articleIds) {
        return articleRepository.findByArticleIdIn(articleIds);
    }

    @Override
    @Transactional(readOnly = true)
    public List<ArticleCardResponse> getRandomArticles() {
        //  MongoDB Aggregation Framework를 사용하여 랜덤기사 12개 추출
        Aggregation aggregation = Aggregation.newAggregation(Aggregation.sample(12));

        AggregationResults<Article> results = mongoTemplate.aggregate(aggregation, "articles", Article.class);

        List<Article> randomArticles = results.getMappedResults();

        return randomArticles.stream().map(ArticleCardResponse::from).toList();
    }

    @Override
    @Transactional(readOnly = true)
    public Slice<ArticleCardResponse> getRecommendArticles(PageRequest pageRequest) {
        // 사용자 검증
        User user = userUtils.getUserFromSecurityContext();
        Long userId = user.getId();
        userRepository.findById(userId)
                .orElseThrow(() -> UserNotFoundException.EXCEPTION);

        // MongoDB에서 사용자별 추천 기사 정보 조회하기
        List<Long> articleIds = getRecommendArticleIds(userId);

        // 시작 인덱스, 종료 인덱스 계산
        int pageSize = pageRequest.getPageSize();
        int pageNumber = pageRequest.getPageNumber();
        int startIndex = pageNumber * pageSize;

        // 페이지 범위 체크
        if (startIndex >= articleIds.size()) {
            return new SliceImpl<>(Collections.emptyList(), pageRequest, false);
        }

        // 현재 페이지에 해당하는 기사 ID 목록 추출
        int endIndex = Math.min(startIndex + pageSize, articleIds.size());
        List<Long> pageArticleIds = articleIds.subList(startIndex, endIndex);

        // 기사 정보 조회
        List<Article> articles = getArticlesByIds(pageArticleIds);

        // 기사 ID 순서대로 정렬 (추천 순서 유지)
        Map<Long, Article> articleMap = articles.stream()
                .collect(Collectors.toMap(Article::getArticleId, article -> article));

        List<ArticleCardResponse> articleResponses = pageArticleIds.stream()
                .map(articleMap::get)
                .filter(Objects::nonNull)
                .map(ArticleCardResponse::from)
                .toList();

        // 더 불러올 데이터가 있는지 확인
        boolean hasNext = endIndex < articleIds.size();

        return new SliceImpl<>(articleResponses, pageRequest, hasNext);
    }

    @Override
    @Transactional(readOnly = true)
    public Slice<ArticleCardResponse> getArticlesByCategory(String category, PageRequest pageRequest) {
        // MongoDB에서 카테고리별 기사 조회
        Query query = new Query(Criteria.where("category").is(category));

        // 페이징 처리를 위한 스킵 및 제한 설정
        query.skip(pageRequest.getPageNumber() * pageRequest.getPageSize());
        query.limit(pageRequest.getPageSize() + 1); // 다음 페이지 존재 여부 확인을 위해 1개 더 가져옴

        // datetime 기준 내림차순 정렬 (최신순)
        query.with(Sort.by(Sort.Direction.DESC, "datetime"));

        List<Article> articles = mongoTemplate.find(query, Article.class, "articles");

        boolean hasNext = articles.size() > pageRequest.getPageSize();

        // 원래 요청한 pageSize만큼만 반환
        if (hasNext) {
            articles = articles.subList(0, pageRequest.getPageSize());
        }

        List<ArticleCardResponse> articleResponses = articles.stream()
                .map(ArticleCardResponse::from)
                .collect(Collectors.toList());

        return new SliceImpl<>(articleResponses, pageRequest, hasNext);
    }

    @Override
    @Transactional
    public void likeArticle(Long articleId) {
        // 사용자 검증
        User user = userUtils.getUserFromSecurityContext();
        Long userId = user.getId();
        userRepository.findById(userId)
                .orElseThrow(() -> UserNotFoundException.EXCEPTION);

        // 이미 좋아요한 기사인지 확인
        Optional<ArticleLike> existingLike = articleLikeRepository.findByUserIdAndArticleId(userId, articleId);

        if (existingLike.isPresent()) {
            // 이미 좋아요한 경우 좋아요 취소 (토글 방식)
            articleLikeRepository.delete(existingLike.get());
        } else {
            // 좋아요 추가
            ArticleLike articleLike = ArticleLike.builder()
                    .user(user)
                    .articleId(articleId)
                    .build();

            articleLikeRepository.save(articleLike);
        }
    }

    @Override
    @Transactional(readOnly = true)
    public ArticleDetailResponse getArticleDetail(Long articleId) {
        // MongoDB의 article_id가 Integer 타입이므로 Long을 Integer로 변환
        Integer articleIdInt = articleId.intValue();

        // 기사 정보 조회
        Query query = new Query(Criteria.where("article_id").is(articleIdInt));
        Article article = mongoTemplate.findOne(query, Article.class, "articles");

        if (article == null) {
            throw ArticleNotFoundException.EXCEPTION;
        }

        // 유사 기사 목록 조회
        List<ArticleCardResponse> similarArticles = getSimilarArticlesForDetail(articleId);

        return ArticleDetailResponse.from(article, similarArticles);
    }


    /**
     * 사용자에게 추천된 기사 ID 목록을 가져오는 메서드
     */
    private List<Long> getRecommendArticleIds(Long userId) {
        // MongoDB에서 사용자별 추천 기사 정보 조회
        Query query = new Query(Criteria.where("user_id").is(userId));
        Document recommendation = mongoTemplate.findOne(query, Document.class, "recommendation");

        if (recommendation != null && recommendation.containsKey("articles")) {
            // MongoDB에 저장된 추천 기사가 있는 경우
            List<Integer> articleIds  = recommendation.getList("articles", Integer.class);
            return articleIds.stream()
                    .map(Integer::longValue)
                    .toList();
        } else {
            return getUserPreferenceBasedRecommendations(userId);
        }
    }


    /**
     * 사용자의 선호 기사를 기반으로 유사 기사 목록을 가져오는 메서드
     */
    private List<Long> getUserPreferenceBasedRecommendations(Long userId) {
        // 사용자의 서놓 기사 목록 조회 (RDB 접근)
        List<UserPreference> userPreferences = userPreferenceRepository.findByUserId(userId);

        if (userPreferences.isEmpty()) {
            return Collections.emptyList();
        }

        // 선호 기사 ID 목록
        List<Long> preferenceArticleIds = userPreferences.stream()
                .map(UserPreference::getArticleId)
                .toList();

        // 각 선호 기사의 유사 기사 정보 조회
        Set<Long> similarArticleIds = new LinkedHashSet<>();

        for (Long articleId : preferenceArticleIds) {
            List<Document> similarArticles = getSimilarArticles(articleId);

            if (similarArticles != null && !similarArticles.isEmpty()) {
                // 유사도 점수를 기준으로 정렬된 유사 기사 ID 목록 추가
                List<Long> sortedSimilarArticleIds = similarArticles.stream()
                        .sorted((a, b) -> {
                            Double scoreA = a.getDouble("similarity_score");
                            Double scoreB = b.getDouble("similarity_score");
                            return scoreB.compareTo(scoreA); // 내림차순 정렬
                        })
                        .map(doc -> {
                            Integer id = doc.getInteger("article_id");
                            return id != null ? id.longValue() : null;
                        })
                        .toList();

                similarArticleIds.addAll(sortedSimilarArticleIds);
            }
        }
        // 선호 기사 자체는 제외
        preferenceArticleIds.forEach(similarArticleIds::remove);

        List<Long> result = new ArrayList<>(similarArticleIds);
        // 추천 기사가 50개 미만이면 랜덤 기사로 채움
        if (result.size() < 50) {
            int needMoreCount = 50 - result.size();
            List<Long> excludeIds = new ArrayList<>(result);
            excludeIds.addAll(preferenceArticleIds); // 이미 추천된 기사와 선호 기사 모두 제외

            List<Long> randomArticles = getRandomArticles(needMoreCount, excludeIds);
            result.addAll(randomArticles);
        }

        return result;
    }

    /**
     * 특정 기사의 유사 기사 목록을 가져오는 메서드
     */
    private List<Document> getSimilarArticles(Long articleId) {
        int id = articleId.intValue();
        Query query = new Query(Criteria.where("article_id").is(id));
        Document similarity = mongoTemplate.findOne(query, Document.class, "similarity");

        if (similarity != null && similarity.containsKey("similar_articles")) {
            return similarity.getList("similar_articles", Document.class);
        }

        return Collections.emptyList();
    }

    /**
     * 기사 ID 목록으로 기사 정보를 조회하는 메서드
     */
    private List<Article> getArticlesByIds(List<Long> articleIds) {
        if (articleIds.isEmpty()) {
            return Collections.emptyList();
        }

        List<Integer> articleIdsInt = articleIds.stream()
                .map(Long::intValue)
                .toList();

        Query query = new Query(Criteria.where("article_id").in(articleIdsInt));
        return mongoTemplate.find(query, Article.class, "articles");
    }

    /**
     * 지정된 수의 랜덤 기사 ID를 가져오는 메서드
     * @param count 가져올 랜덤 기사 수
     * @param excludeIds 제외할 기사 ID 목록
     * @return 랜덤 기사 ID 목록
     */
    private List<Long> getRandomArticles(int count, List<Long> excludeIds) {
        if (count <= 0) {
            return Collections.emptyList();
        }

        // 제외할 기사 ID가 Integer 타입으로 변환
        List<Integer> excludeIdInts = excludeIds.stream()
                .map(Long::intValue)
                .collect(Collectors.toList());

        // 집계 파이프라인 단계 생성
        List<AggregationOperation> operations = new ArrayList<>();

        // 제외할 기사 ID가 있는 경우 매치 조건 추가
        if (!excludeIdInts.isEmpty()) {
            operations.add(Aggregation.match(Criteria.where("article_id").nin(excludeIdInts)));
        }

        // 샘플링 및 프로젝션 추가
        operations.add(Aggregation.sample(count));
        operations.add(Aggregation.project("article_id"));

        // 집계 파이프라인 실행
        List<Document> randomDocs = mongoTemplate.aggregate(
                Aggregation.newAggregation(operations),
                "articles",
                Document.class
        ).getMappedResults();

        // 결과에서 기사 ID만 추출 (Integer -> Long 변환)
        return randomDocs.stream()
                .map(doc -> doc.getInteger("article_id"))
                .filter(Objects::nonNull)
                .map(Integer::longValue)
                .toList();
    }

    /**
     * 상세보기에서 사용할 유사 기사 목록 조회
     */
    private List<ArticleCardResponse> getSimilarArticlesForDetail(Long articleId) {
        // 기존 메서드를 활용하여 유사 기사 목록 가져오기
        List<Document> similarArticleDocs = getSimilarArticles(articleId);

        if (similarArticleDocs.isEmpty()) {
            return Collections.emptyList();
        }

        // 유사도 점수 기준으로 정렬된 유사 기사 ID 목록
        List<Integer> similarArticleIds = similarArticleDocs.stream()
                .sorted((a, b) -> {
                    Double scoreA = a.getDouble("similarity_score");
                    Double scoreB = b.getDouble("similarity_score");
                    return scoreB.compareTo(scoreA); // 내림차순 정렬
                })
                .limit(5) // 상위 5개만 가져오기
                .map(doc -> doc.getInteger("article_id"))
                .collect(Collectors.toList());

        if (similarArticleIds.isEmpty()) {
            return Collections.emptyList();
        }

        // 유사 기사 정보 조회
        Query articlesQuery = new Query(Criteria.where("article_id").in(similarArticleIds));
        List<Article> similarArticles = mongoTemplate.find(articlesQuery, Article.class, "articles");

        // 유사 기사 ID 순서대로 정렬 (유사도 순서 유지)
        Map<Integer, Article> articleMap = similarArticles.stream()
                .collect(Collectors.toMap(article -> article.getArticleId().intValue(), article -> article));

        return similarArticleIds.stream()
                .map(articleMap::get)
                .filter(Objects::nonNull)
                .map(ArticleCardResponse::from)
                .toList();
    }
//    @Override
//    @Transactional(readOnly = true)
//    public List<Article> getRecommendArticles() {
//        /**
//         * 사용자 로그 기반의
//         */
//    }
}
