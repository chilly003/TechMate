package io.ssafy.p.s12b201.techmate.domain.article.service;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import io.ssafy.p.s12b201.techmate.domain.article.domain.Article;
import io.ssafy.p.s12b201.techmate.domain.article.domain.repository.ArticleRepository;
import io.ssafy.p.s12b201.techmate.domain.article.exception.*;
import io.ssafy.p.s12b201.techmate.domain.article.presentation.dto.requset.ChatRequestDto;
import io.ssafy.p.s12b201.techmate.domain.article.presentation.dto.requset.MessageDto;
import io.ssafy.p.s12b201.techmate.domain.article.presentation.dto.requset.QuizResultRequest;
import io.ssafy.p.s12b201.techmate.domain.article.presentation.dto.response.*;
import io.ssafy.p.s12b201.techmate.domain.articlelike.domain.repository.ArticleLikeRepository;
import io.ssafy.p.s12b201.techmate.domain.articleread.domain.ArticleRead;
import io.ssafy.p.s12b201.techmate.domain.articleread.domain.repository.ArticleReadRepository;
import io.ssafy.p.s12b201.techmate.domain.quizresult.domain.QuizResult;
import io.ssafy.p.s12b201.techmate.domain.quizresult.domain.repository.QuizResultRepository;
import io.ssafy.p.s12b201.techmate.domain.scrap.domain.Scrap;
import io.ssafy.p.s12b201.techmate.domain.scrap.domain.repository.ScrapRepository;
import io.ssafy.p.s12b201.techmate.domain.user.domain.User;
import io.ssafy.p.s12b201.techmate.domain.user.domain.repository.UserRepository;
import io.ssafy.p.s12b201.techmate.domain.userpreference.domain.UserPreference;
import io.ssafy.p.s12b201.techmate.domain.userpreference.domain.repository.UserPreferenceRepository;
import io.ssafy.p.s12b201.techmate.global.aop.DistributedLock;
import io.ssafy.p.s12b201.techmate.global.api.client.SolarProClient;
import io.ssafy.p.s12b201.techmate.global.exception.UserNotFoundException;
import io.ssafy.p.s12b201.techmate.global.utils.user.UserUtils;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.bson.Document;
import org.redisson.api.RLock;
import org.redisson.api.RedissonClient;
import org.springframework.beans.factory.annotation.Value;
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

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.*;
import java.util.concurrent.TimeUnit;
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
    private final ArticleReadRepository articleReadRepository;
    private final SolarProClient solarProClient;
    private final ObjectMapper objectMapper;
    private final RedissonClient redissonClient;
    private final QuizResultRepository quizResultRepository;
    private final ArticleLikeRepository articleLikeRepository;
    private final ScrapRepository   scrapRepository;

    @Value("${solar-pro.api-key}")
    private String apiKey;

    @Override
    public Article getArticleById(Long articleId) {
        return articleRepository
                .findByArticleId(articleId).orElseThrow(() -> ArticleNotFoundException.EXCEPTION);

    }

    @Override
    public List<Article> getArticlesByArticleIds(List<Long> articleIds) {
        return articleRepository.findByArticleIdIn(articleIds);
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

        // 중복 제거 후에도 충분한 기사를 보여주기 위해 더 많은 데이터 요청
        int requestSize = pageRequest.getPageSize() * 2;
        int pageNumber = pageRequest.getPageNumber();
        int startIndex = pageNumber * pageRequest.getPageSize();

        // 페이지 범위 체크
        if (startIndex >= articleIds.size()) {
            return new SliceImpl<>(Collections.emptyList(), pageRequest, false);
        }

        // 현재 페이지 기준으로 충분한 기사 ID 목록 추출
        int endIndex = Math.min(startIndex + requestSize, articleIds.size());
        List<Long> requestArticleIds = articleIds.subList(startIndex, endIndex);

        // 기사 정보 조회
        List<Article> articles = getArticlesByIds(requestArticleIds);

        // 기사 ID 순서대로 정렬 (추천 순서 유지)
        Map<Long, Article> articleMap = articles.stream()
                .collect(Collectors.toMap(Article::getArticleId, article -> article));

        List<Article> orderedArticles = requestArticleIds.stream()
                .map(articleMap::get)
                .filter(Objects::nonNull)
                .collect(Collectors.toList());

        // 공통 로직 사용: 제목 기반 중복 제거 및 페이징 처리
        return getUniqueArticlesSlice(orderedArticles, pageRequest);
    }

    @Override
    @Transactional(readOnly = true)
    public Slice<ArticleCardResponse> getRecentArticles(PageRequest pageRequest) {
        // 1. MongoDB에서 최신순 기사 조회 (중복 제거 후에도 충분한 데이터를 위해 2배 요청)
        Query query = new Query()
                .with(Sort.by(Sort.Direction.DESC, "datetime"))
                .skip(pageRequest.getOffset())
                .limit(pageRequest.getPageSize() * 2);

        List<Article> articles = mongoTemplate.find(query, Article.class, "articles");

        // datetime 기준으로 재정렬
        articles.sort((a1, a2) -> a2.getDatetime().compareTo(a1.getDatetime())); // 내림차순

        // 공통 로직 사용: 제목 기반 중복 제거 및 페이징 처리
        return getUniqueArticlesSlice(articles, pageRequest);
    }

    @Override
    @Transactional(readOnly = true)
    public Slice<ArticleCardResponse> getHotArticles(PageRequest pageRequest) {

        // 현재 날짜로부터 2주 전 날짜 계산
        LocalDateTime twoWeeksAgo = LocalDateTime.now().minusWeeks(2);
        String twoWeeksAgoStr = twoWeeksAgo.format(DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss"));
        // 1. 데이터베이스에서 직접 그룹화하여 조회수 계산 (성능 최적화)
        // 중복 제거를 위해 더 많은 데이터 요청
        int requestSize = pageRequest.getPageSize() * 2;

        List<Object[]> popularArticlesWithCount = articleReadRepository.findTopArticlesByReadCount(
                requestSize,  // 더 많은 데이터 요청
                pageRequest.getOffset()
        );

        if (popularArticlesWithCount.isEmpty()) {
            return new SliceImpl<>(Collections.emptyList(), pageRequest, false);
        }

        // articleId 목록 추출
        List<Long> popularArticleIds = popularArticlesWithCount.stream()
                .map(row -> (Long) row[0])
                .toList();

        // 2. MongoDB에서 해당 기사 조회 (정렬 없이)
        // Integer로 변환하여 MongoDB 쿼리
        List<Integer> articleIdInts = popularArticleIds.stream()
                .map(Long::intValue)
                .toList();

        Query query = new Query(Criteria.where("article_id").in(articleIdInts)
                .and("datetime").gte(twoWeeksAgoStr));
        List<Article> articles = mongoTemplate.find(query, Article.class, "articles");

        // 4. 조회수 순서대로 정렬
        Map<Long, Article> articleMap = articles.stream()
                .collect(Collectors.toMap(
                        Article::getArticleId,
                        article -> article,
                        (a1, a2) -> a1
                ));

        // 인기순(조회수순)으로 정렬된 기사 목록
        List<Article> orderedArticles = popularArticleIds.stream()
                .map(articleMap::get)
                .filter(Objects::nonNull)  // MongoDB에서 삭제된 기사 제외
                .collect(Collectors.toList());

        // 공통 로직 사용: 제목 기반 중복 제거 및 페이징 처리
        return getUniqueArticlesSlice(orderedArticles, pageRequest);
    }

    @Override
    @Transactional(readOnly = true)
    public Slice<ArticleCardResponse> getArticlesByCategory(String category, PageRequest pageRequest) {
        // MongoDB에서 카테고리별 기사 조회 (중복 제거 후에도 충분한 데이터를 위해 2배 요청)
        Query query = new Query(Criteria.where("category").is(category));

        // 페이징 처리를 위한 스킵 및 제한 설정
        query.skip(pageRequest.getPageNumber() * pageRequest.getPageSize());
        query.limit(pageRequest.getPageSize() * 2); // 중복 제거 후에도 충분한 데이터를 위해 2배 요청

        // datetime 기준 내림차순 정렬 (최신순)
        query.with(Sort.by(Sort.Direction.DESC, "datetime"));

        List<Article> articles = mongoTemplate.find(query, Article.class, "articles");

        // 공통 로직 사용: 제목 기반 중복 제거 및 페이징 처리
        return getUniqueArticlesSlice(articles, pageRequest);
    }

    @Override
    @Transactional
    public ArticleDetailResponse getArticleDetail(Long articleId) {
        // 사용자 검증
        User user = userUtils.getUserFromSecurityContext();
        Long userId = user.getId();
        userRepository.findById(userId)
                .orElseThrow(() -> UserNotFoundException.EXCEPTION);

        // MongoDB의 article_id가 Integer 타입이므로 Long을 Integer로 변환
        Integer articleIdInt = articleId.intValue();

        // 기사 정보 조회
        Query query = new Query(Criteria.where("article_id").is(articleIdInt));
        Article article = mongoTemplate.findOne(query, Article.class, "articles");

        if (article == null) {
            throw ArticleNotFoundException.EXCEPTION;
        }

        // 읽은 기록 저장
        saveArticleRead(user, articleId);

        // 유사 기사 목록 조회
        List<ArticleCardResponse> similarArticles = getSimilarArticlesForDetail(articleId);

        // 좋아요 여부 확인
        boolean isLiked = articleLikeRepository.existsByUserIdAndArticleId(userId, articleId);

        // 스크랩 아이디 조회 및 스크랩 여부 조회
        Optional<Scrap> scrap = scrapRepository.findByUserIdAndArticleId(userId, articleId);

        boolean isScraped = scrap.isPresent();
        Long scrapId = isScraped ? scrap.get().getId() : null;

        return ArticleDetailResponse.from(article, similarArticles, isLiked, isScraped, scrapId);
    }

    @Override
    @Transactional(readOnly = true)
    public Slice<ArticleCardResponse> searchArticles(String keyword, PageRequest pageRequest) {
        // 검색 쿼리 생성 - $or 연산자를 사용하여 여러 필드에서 검색
        Query query = new Query(
                new Criteria().orOperator(
                        Criteria.where("title").regex(keyword, "i"),
                        Criteria.where("content").regex(keyword, "i")
                )
        );

        // 최신순 정렬
        query.with(Sort.by(Sort.Direction.DESC, "datetime"));

        // 페이징 처리
        query.skip(pageRequest.getOffset());
        query.limit(pageRequest.getPageSize() + 1); // 다음 페이지 확인용

        // 필요한 필드만 프로젝션으로 가져오기 (성능 최적화)
        query.fields()
                .include("article_id")
                .include("title")
                .include("journal")
                .include("summary")
                .include("datetime")
                .include("category")
                .include("images");

        // 결과 조회
        List<Article> articles = mongoTemplate.find(query, Article.class, "articles");

        // 다음 페이지 여부 확인
        boolean hasNext = articles.size() > pageRequest.getPageSize();
        if (hasNext) {
            articles = articles.subList(0, pageRequest.getPageSize());
        }

        // DTO 변환
        List<ArticleCardResponse> content = articles.stream()
                .map(ArticleCardResponse::from)
                .collect(Collectors.toList());

        return new SliceImpl<>(content, pageRequest, hasNext);
    }

    /**
     * 사용자의 기사 읽은 기록 저장
     */
    private void saveArticleRead(User user, Long articleId) {
        // 이미 읽은 기록이 있는지 확인
        Optional<ArticleRead> existingRead = articleReadRepository.findByUserIdAndArticleId(user.getId(), articleId);

        if (existingRead.isEmpty()) {
            // 읽은 기록이 없는 경우에만 저장
            ArticleRead articleRead = ArticleRead.builder()
                    .user(user)
                    .articleId(articleId)
                    .build();

            articleReadRepository.save(articleRead);
        }
        // 읽은 기록이 이미 있는 경우는 아무것도 하지 않음
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
                            Object id = doc.get("article_id");
                            if (id instanceof Number) {
                                return ((Number) id).longValue();
                            }
                            return null;
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
                .map(doc -> {
                    // article_id가 Integer일 수도 있고 Long일 수도 있는 경우 처리
                    Object articleId = doc.get("article_id");
                    if (articleId instanceof Integer) {
                        return ((Integer) articleId).longValue();
                    } else if (articleId instanceof Long) {
                        return (Long) articleId;
                    }
                    return null;
                })
                .filter(Objects::nonNull)
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

    public ChatResponseDto chatWithSolarPro(String userMessage) {
        try {
            MessageDto message = new MessageDto("user", userMessage);
            ChatRequestDto request = new ChatRequestDto(
                    "solar-pro",
                    Collections.singletonList(message),
                    false
            );

            String authorization = "Bearer " + apiKey;
            return solarProClient.chat(authorization, request);
        } catch (Exception e) {
            throw SolarException.EXCEPTION;
        }
    }

    public String getAssistantMessage(String userMessage) {
        ChatResponseDto response = chatWithSolarPro(userMessage);
        if (response.getChoices() == null || response.getChoices().isEmpty()) {
            throw SolarException.EXCEPTION;
        }
        return response.getChoices().get(0).getMessage().getContent();
    }

    public String buildPrompt(String content) {
        return String.format(
                "다음 기사 내용을 기반으로 객관식 퀴즈 3개를 생성하세요.\n" +
                        "- 질문은 기사 주요 내용을 기반\n" +
                        "- 각 질문은 3개의 선택지와 정답 1개 (is_correct: true)\n" +
                        "- 정답 이유는 reason 필드로 설명\n" +
                        "- 결과는 다음 JSON 구조를 따르세요:\n\n" +
                        "{\n" +
                        "  \"quizzes\": [\n" +
                        "    {\n" +
                        "      \"quiz_id\": 1,\n" +
                        "      \"question\": \"...\",\n" +
                        "      \"options\": [\n" +
                        "        {\"option_id\": 1, \"text\": \"...\", \"is_correct\": false},\n" +
                        "        {\"option_id\": 2, \"text\": \"...\", \"is_correct\": true},\n" +
                        "        {\"option_id\": 3, \"text\": \"...\", \"is_correct\": false}\n" +
                        "      ],\n" +
                        "      \"reason\": \"...\"\n" +
                        "    }\n" +
                        "  ]\n" +
                        "}\n\n" +
                        "본문: %s",
                content
        );
    }

    public QuizResponseDto generateQuizzes(String content) {

        String prompt = buildPrompt(content);

        String jsonResponse = getAssistantMessage(prompt);

        try {
            if (!jsonResponse.trim().startsWith("{")) {
                throw JsonParseException.EXCEPTION;
            }
            QuizResponseDto quizResponse = objectMapper.readValue(jsonResponse, QuizResponseDto.class);

            // 퀴즈 검증
            for (QuizDto quiz : quizResponse.getQuizzes()) {
                long correctCount = quiz.getOptions().stream()
                        .filter(OptionDto::getIsCorrect)
                        .count();
                if (correctCount != 1) {
                    throw SolarException.EXCEPTION;
                }

                // reason 검증
                if (quiz.getReason() == null || quiz.getReason().isEmpty()) {
                    log.warn("reason이 누락됨: quiz_id = {}", quiz.getQuizId());
                }
            }

            return quizResponse;
        } catch (JsonProcessingException e) {
            throw JsonParseException.EXCEPTION;
        }
    }

//    public QuizResponse getArticleWithQuizzes(Long articleId) {
//        log.info("=========================== 여기가 시작입니다 ========================");
//
//        Article article = getArticleById(articleId);
//        User user = userUtils.getUserFromSecurityContext();
//        log.info("user = {}", user.getId());
//
//        if (article.getQuizGenerated()) {
//            log.info("기사 {}의 퀴즈가 이미 생성되어 있습니다.", articleId);
//            List<QuizResult> quizResults = quizResultRepository.findAllByArticleIdAndUserOrderByQuizIdAsc(articleId, user);
//
//            if (quizResults.isEmpty()) {
//                return new QuizResponse(article, false, null);
//            }
//
//            List<SelectOptionDto> selectOptionDtoList = quizResults.stream()
//                    .map(result -> new SelectOptionDto(result.getQuizId(), result.getSelectedOptionId()))
//                    .toList();
//
//            return new QuizResponse(article, true, selectOptionDtoList);
//        }
//
//        return generateQuizWithLock(article);
//    }

//    @DistributedLock(key = "'quiz:lock:article:' + #articleId", waitTime = 1L, leaseTime = 12L)
//    private QuizResponse generateQuizWithLock(Article article) {
//        log.info("기사 {}에 대한 퀴즈 생성 시작", article.getId());
//        QuizResponseDto quizResponse = generateQuizzes(article.getContent());
//        log.info("Generated quizzes: {}", quizResponse.getQuizzes());
//
//        quizResponse.getQuizzes().forEach(quiz ->
//                quiz.getOptions()
//                        .forEach(option -> option.setOptionSelectionRate(0.0))
//        );
//
//        article.insertQuiz(quizResponse.getQuizzes());
//        articleRepository.save(article);
//        log.info("기사 {}의 퀴즈 생성 및 저장 완료", article.getId());
//
//        return new QuizResponse(article, false, null);
//    }

//    @DistributedLock(key = "'quiz:lock:article:' + #articleId", waitTime = 1L, leaseTime = 12L)
//    public QuizResponse getArticleWithQuizzes(Long articleId) {
//        log.info("=========================== 여기가 시작입니다 ========================");
//
//        Article article = getArticleById(articleId);
//        User user = userUtils.getUserFromSecurityContext();
//
//        log.info("user = {}", user.getId());
//
//        if (article.getQuizGenerated()) {
//            log.info("기사 {}의 퀴즈가 이미 생성되어 있습니다.", articleId);
//            List<QuizResult> quizResults = quizResultRepository.findAllByArticleIdAndUserOrderByQuizIdAsc(articleId, user);
//
//            if (quizResults.isEmpty()) {
//                return new QuizResponse(article, false, null);
//            }
//
//            List<SelectOptionDto> selectOptionDtoList = quizResults.stream()
//                    .map(result -> new SelectOptionDto(result.getQuizId(), result.getSelectedOptionId()))
//                    .toList();
//
//            return new QuizResponse(article, true, selectOptionDtoList);
//        }
//
//        log.info("기사 {}에 대한 퀴즈 생성 시작", articleId);
//        QuizResponseDto quizResponse = generateQuizzes(article.getContent());
//        log.info("Generated quizzes: {}", quizResponse.getQuizzes());
//
//        quizResponse.getQuizzes().forEach(quiz ->
//                quiz.getOptions()
//                        .forEach(option -> option.setOptionSelectionRate(0.0))
//        );
//
//        Article currentArticle = getArticleById(articleId);
//        currentArticle.insertQuiz(quizResponse.getQuizzes());
//        articleRepository.save(currentArticle);
//        log.info("기사 {}의 퀴즈 생성 및 저장 완료", articleId);
//
//        return new QuizResponse(currentArticle, false, null);
//    }

    /*
    추후 삭제
     */

    public QuizResponse getArticleWithQuizzes(Long articleId) {

        Article article = getArticleById(articleId);

        User user = userUtils.getUserFromSecurityContext();

        log.info("=========================== 여기가 시작입니다 ========================");
        log.info("user = {}",user.getId());

        if (article.getQuizGenerated()) {
            log.info("기사 {}의 퀴즈가 이미 생성되어 있습니다.", articleId);
            List<QuizResult> quizResults = quizResultRepository.findAllByArticleIdAndUserOrderByQuizIdAsc(articleId,user);

            if (quizResults.isEmpty()) {
                return new QuizResponse(article,false,null);
            }

            ArrayList<SelectOptionDto> list = new ArrayList<>();

            for (QuizResult quizResult : quizResults) {
                SelectOptionDto selectOptionDto = new SelectOptionDto();
                selectOptionDto.setQuizId(quizResult.getQuizId());
                selectOptionDto.setOptionId(quizResult.getSelectedOptionId());
                list.add(selectOptionDto);
            }

            return new QuizResponse(article,true,list);
        }

        // 3. Redis 분산 락 설정
        String lockKey = "quiz:lock:article:" + articleId;
        RLock lock = redissonClient.getLock(lockKey);

        try {
            boolean isLocked = lock.tryLock(1, 20, TimeUnit.SECONDS);
            if (isLocked) {

                log.info("락을 획특했습니다 user = {}",user.getId());

                // 5. 락 획득 후 이중 체크
                Article article1 = getArticleById(articleId);
                if (article1.getQuizGenerated()) {
                    log.info("기사 {}의 퀴즈가 이미 생성됨 (이중 체크)", articleId);
                    log.info("user = {}",user.getId());
                    throw QuizAlreadyExistsException.EXCEPTION;
                }

                // 6. Solar API로 퀴즈 생성
                log.info("기사 {}에 대한 퀴즈 생성 시작", articleId);
                QuizResponseDto quizResponse = generateQuizzes(article.getContent());
                log.info("Generated quizzes: {}", quizResponse.getQuizzes());

                quizResponse.getQuizzes().forEach(quiz ->
                        quiz.getOptions()
                                .forEach(option -> option.setOptionSelectionRate(0.0))
                );

                if (article.getQuizGenerated()) {
                    log.info("기사 {}의 퀴즈가 이미 생성되어 있습니다.", articleId);
                    List<QuizResult> quizResults = quizResultRepository.findAllByArticleIdAndUserOrderByQuizIdAsc(articleId,user);

                    if (quizResults.isEmpty()) {
                        return new QuizResponse(article,false,null);
                    }

                    ArrayList<SelectOptionDto> list = new ArrayList<>();

                    for (QuizResult quizResult : quizResults) {
                        SelectOptionDto selectOptionDto = new SelectOptionDto();
                        selectOptionDto.setQuizId(quizResult.getQuizId());
                        selectOptionDto.setOptionId(quizResult.getSelectedOptionId());
                        list.add(selectOptionDto);
                    }

                    return new QuizResponse(article,true,list);
                }
                
                article.setQuizzes(quizResponse.getQuizzes());
                article.setQuizGenerated(true);
                article.setCorrectness("84.2%");

                // 8. MongoDB에 저장
                articleRepository.save(article);
                log.info("기사 {}의 퀴즈 생성 및 저장 완료", articleId);
                return new QuizResponse(article,false,null);
            }
            // 9. 락 획득 실패 시 예외 던지기
            log.info("기사 {} 퀴즈 생성 중", articleId);
            log.info("락을 획특 실패 user = {}",user.getId());
            throw QuizAlreadyExistsException.EXCEPTION;

        } catch (QuizAlreadyExistsException e) {

            log.error("기사 {} 퀴즈 처리 중 오류", articleId, e);
            log.info("user = {}",user.getId());
            throw QuizAlreadyExistsException.EXCEPTION;
        } catch (Exception e) {

            log.error("기사 {} 퀴즈 처리 중 오류", articleId, e);
            log.info("user = {}",user.getId());
            throw SolarException.EXCEPTION;
        }
        finally {

            if (lock.isHeldByCurrentThread()) {
                lock.unlock();
                log.info("user = {}",user.getId());
                log.info("기사 {}의 락 해제 완료", articleId);
            }
        }
    }


    @Transactional
    public void createQuizResult(Long articleId, List<QuizResultRequest> quizResultRequests) {
        // 1. 사용자 및 Article 조회
        User user = userUtils.getUserFromSecurityContext();
        Article article = getArticleById(articleId);

        // 2. 예외 처리
        if (quizResultRepository.existsByArticleIdAndUser(articleId, user)) {
            throw QuizAlreadyAttemptedException.EXCEPTION;
        }

        if (!article.getQuizGenerated()) {
            throw QuizNotFoundException.EXCEPTION;
        }

        // 3. QuizResult 저장
        for (QuizResultRequest request : quizResultRequests) {
            QuizResult quizResult = QuizResult.builder()
                    .quizId(request.getQuizId())
                    .user(user)
                    .articleId(articleId)
                    .selectedOptionId(request.getSelectedOptionId())
                    .build();
            quizResultRepository.save(quizResult);
        }

        quizResultRepository.flush();

        // 4. optionSelectionRate 갱신
        updateOptionSelectionRates(articleId);

    }

    private void updateOptionSelectionRates(Long articleId) {
        // 1. MySQL에서 QuizResult 조회
        List<QuizResult> quizResults = quizResultRepository.findAllByArticleId(articleId);
        if (quizResults == null || quizResults.isEmpty()) {
            log.info("No QuizResults found for articleId: {}", articleId);
            return;
        }

        // QuizResult 로그 출력
        for (QuizResult quizResult : quizResults) {
            log.info("QuizResult - id: {}, quizId: {}, selectedOptionId: {}",
                    quizResult.getId(), quizResult.getQuizId(), quizResult.getSelectedOptionId());
        }

        // 2. quizId별로 그룹화
        Map<Long, List<QuizResult>> quizResultsByQuizId = quizResults.stream()
                .collect(Collectors.groupingBy(QuizResult::getQuizId));
        log.info("quizResultsByQuizId: {}", quizResultsByQuizId);

        // 3. MongoDB에서 Article 조회
        Article article = getArticleById(articleId);
        if (article.getQuizzes() == null || article.getQuizzes().isEmpty()) {
            log.warn("No quizzes found in Article for articleId: {}", articleId);
            return;
        }

        // Article.quizzes의 quizId 로그 출력
//        article.getQuizzes().forEach(quiz ->
//                log.info("Article Quiz - quizId: {}, type: {}, options: {}",
//                        quiz.getQuizId(), quiz.getQuizId() != null ? quiz.getQuizId().getClass().getSimpleName() : "null", quiz.getOptions())
//        );

        int i = 0;

        // 4. 각 quizId에 대해 optionSelectionRate 계산  퀴즈 1,2,3 저장되있음
        for (Map.Entry<Long, List<QuizResult>> entry : quizResultsByQuizId.entrySet()) {
            Long quizId = entry.getKey();
            List<QuizResult> results = entry.getValue();
            int totalResponses = results.size();
            log.info("Processing quizId: {}, type: {}, totalResponses: {}",
                    quizId, quizId != null ? quizId.getClass().getSimpleName() : "null", totalResponses);

            // 퀴즈 1, 2, 3에 대한 optionId별 선택 횟수 계산
            QuizDto quiz = article.getQuizzes().get(i);
            Map<Long, Long> optionCounts = new HashMap<>();

            // 모든 optionId를 0으로 초기화
            quiz.getOptions().forEach(option -> {
                Integer optionIdInt = option.getOptionId();
                Long optionId = optionIdInt != null ? optionIdInt.longValue() : null;
                if (optionId != null) {
                    optionCounts.put(optionId, 0L);
                }
            });

            // 선택된 optionId의 횟수 반영
            results.stream()
                    .collect(Collectors.groupingBy(QuizResult::getSelectedOptionId, Collectors.counting()))
                    .forEach(optionCounts::put);

            log.info("optionCounts for quizId {}: {}", quizId, optionCounts);

            List<OptionDto> options = article.getQuizzes().get(i).getOptions();

            long k = 1;

            for (OptionDto option : options) {

                if (totalResponses > 0) {
                    double selectionRate = (optionCounts.get(k) * 100.0) / totalResponses;
                    option.setOptionSelectionRate(selectionRate);
                }

                k++;
            }

            i++;
        }

        // 5. MongoDB에 저장
        log.info("Saving Article with updated optionSelectionRates for articleId: {}", articleId);
        articleRepository.save(article);
    }

//    private void updateOptionSelectionRates(Long articleId) {
//        // 1. MySQL에서 QuizResult 조회
//        List<QuizResult> quizResults = quizResultRepository.findAllByArticleId(articleId);
//        if (quizResults == null || quizResults.isEmpty()) {
//            log.info("No QuizResults found for articleId: {}", articleId);
//            return;
//        }
//
//        // QuizResult 로그 출력
//        for (QuizResult quizResult : quizResults) {
//            log.info("QuizResult - id: {}, quizId: {}, selectedOptionId: {}",
//                    quizResult.getId(), quizResult.getQuizId(), quizResult.getSelectedOptionId());
//        }
//
//        // 2. quizId별로 그룹화
//        Map<Long, List<QuizResult>> quizResultsByQuizId = quizResults.stream()
//                .collect(Collectors.groupingBy(QuizResult::getQuizId));
//        log.info("quizResultsByQuizId: {}", quizResultsByQuizId);
//
//        // 3. MongoDB에서 Article 조회
//        Article article = getArticleById(articleId);
//        if (article.getQuizzes() == null || article.getQuizzes().isEmpty()) {
//            log.warn("No quizzes found in Article for articleId: {}", articleId);
//            return;
//        }
//
//        // 4. 각 quizId에 대해 optionSelectionRate 계산
//        for (Map.Entry<Long, List<QuizResult>> entry : quizResultsByQuizId.entrySet()) {
//            Long quizId = entry.getKey();
//            List<QuizResult> results = entry.getValue();
//            int totalResponses = results.size();
//            log.info("Processing quizId: {}, totalResponses: {}", quizId, totalResponses);
//
//            // optionId별 선택 횟수 계산
//            Map<Long, Long> optionCounts = results.stream()
//                    .collect(Collectors.groupingBy(QuizResult::getSelectedOptionId, Collectors.counting()));
//            log.info("optionCounts for quizId {}: {}", quizId, optionCounts);
//
//            // Article의 quizzes에서 해당 quizId 찾기
//            article.getQuizzes().stream()
//                    .filter(quiz -> quiz.getQuizId().equals(quizId))
//                    .findFirst()
//                    .ifPresent(quiz -> {
//                        if (quiz.getOptions() == null || quiz.getOptions().isEmpty()) {
//                            log.warn("No options found for quizId: {} in Article for articleId: {}", quizId, articleId);
//                            return;
//                        }
//
//                        // 각 option에 대해 selectionRate 계산 및 로그 출력
//                        quiz.getOptions().forEach(option -> {
//                            Integer optionId = option.getOptionId();
//                            long selectedCount = optionCounts.getOrDefault(optionId, 0L);
//                            double selectionRate = totalResponses > 0 ? (selectedCount * 100.0) / totalResponses : 0.0;
//                            log.info("quizId: {}, optionId: {}, selectedCount: {}, selectionRate: {}",
//                                    quizId, optionId, selectedCount, selectionRate);
//                            option.setOptionSelectionRate(selectionRate);
//                        });
//                    });
//        }
//
//        // 5. MongoDB에 저장
//        articleRepository.save(article);
//    }

//    @Transactional
//    public void createQuizResult(Long articleId, List<QuizResultRequest> quizResultRequest) {
//
//        User user = userUtils.getUserFromSecurityContext();
//
//        Article article = getArticleById(articleId);
//
//        if (quizResultRepository.existsByArticleIdAndUser(articleId, user)) {
//            throw QuizAlreadyAttemptedException.EXCEPTION;
//        }
//
//        if (!article.getQuizGenerated()) {
//            throw QuizNotFoundException.EXCEPTION;
//        }
//
//        for (QuizResultRequest quizResultRequest1 : quizResultRequest) {
//
//            QuizResult quizResult = QuizResult.builder()
//                    .quizId(quizResultRequest1.getQuizId())
//                    .user(user)
//                    .articleId(articleId)
//                    .selectedOptionId(quizResultRequest1.getSelectedOptionId())
//                    .build();
//
//            quizResultRepository.save(quizResult);
//        }
//
//    }

    /**
     * 제목 기반 중복 제거 후 페이징 처리된 기사 목록 반환
     * @param articles 원본 기사 목록
     * @param pageRequest 페이징 정보
     * @return 페이징 처리된 기사 카드 응답 목록
     */
    private Slice<ArticleCardResponse> getUniqueArticlesSlice(List<Article> articles, PageRequest pageRequest) {
        // 제목 기반 중복 제거 (순서 유지)
        Map<String, ArticleCardResponse> uniqueResponses = new LinkedHashMap<>();
        for (Article article : articles) {
            ArticleCardResponse response = ArticleCardResponse.from(article);
            uniqueResponses.putIfAbsent(response.getTitle(), response);
        }

        List<ArticleCardResponse> uniqueArticleResponses = new ArrayList<>(uniqueResponses.values());

        boolean hasNext = uniqueArticleResponses.size() > pageRequest.getPageSize();
        List<ArticleCardResponse> pageContent = uniqueArticleResponses;

        if (hasNext) {
            pageContent = uniqueArticleResponses.subList(0, pageRequest.getPageSize());
        }

        return new SliceImpl<>(pageContent, pageRequest, hasNext);
    }

}
