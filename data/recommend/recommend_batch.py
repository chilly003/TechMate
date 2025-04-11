import pandas as pd
import numpy as np
from sklearn.metrics.pairwise import cosine_similarity
from sklearn.feature_extraction.text import TfidfVectorizer
import pymysql
import pymongo
from datetime import datetime, timedelta
#import schedule
##import time
import time
#from bs4 import BeautifulSoup
import re
import logging
import json
from collections import defaultdict
from pymongo import MongoClient, ReturnDocument
# 로깅 설정
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

# MySQL 연결 설정
def get_mysql_connection():
    return pymysql.connect(
	    host='43.200.1.146',
        port=3306,
        user='J12B201',
        password='ssafy12b201',
        db='techmate',
        charset='utf8mb4',
        cursorclass=pymysql.cursors.DictCursor
    )

# mysql -u J12B201 -h 43.200.1.146 -p ssafy12b201 --port 3306

# def get_mysql_connection():
#     return pymysql.connect(
# 	    host='localhost',
#         port=3306,
#         user='root',
#         password='1234',
#         db='ssafy',
#         charset='utf8mb4',
#         cursorclass=pymysql.cursors.DictCursor
#     )

# MongoDB 연결 설정
def get_mongodb_connection():
    client = MongoClient("mongodb+srv://S12P21B201:KqdHQ58L81@ssafy.ngivl.mongodb.net/S12P21B201?authSource=admin")
    db = client["S12P21B201"]           # 사용할 데이터베이스 이름
    return db

def fetch_user_interaction_logs():
    conn = get_mysql_connection()
    try:
        with conn.cursor() as cursor:
            seven_days_ago = (datetime.now() - timedelta(days=60)).strftime('%Y-%m-%d %H:%M:%S')
#           seven_days_ago = (datetime.now() - timedelta(days=7)).strftime('%Y-%m-%d %H:%M:%S')

            sql = """
             SELECT 
                ua.user_id, 
                ua.article_id, 
                SUM(CASE WHEN ar.created_at IS NOT NULL THEN 1 ELSE 0 END) AS view_count,
                SUM(CASE WHEN al.created_at IS NOT NULL THEN 3 ELSE 0 END) AS like_count,
                SUM(CASE WHEN s.created_at IS NOT NULL THEN 5 ELSE 0 END) AS scrap_count,
                MAX(GREATEST(IFNULL(ar.created_at, '1900-01-01'), IFNULL(al.created_at, '1900-01-01'), IFNULL(s.created_at, '1900-01-01'))) AS last_interaction
            FROM 
                (SELECT DISTINCT user_id, article_id FROM article_reads 
                 UNION 
                 SELECT DISTINCT user_id, article_id FROM article_likes 
                 UNION 
                 SELECT DISTINCT user_id, article_id FROM scraps) AS ua
            LEFT JOIN article_reads ar ON ua.user_id = ar.user_id AND ua.article_id = ar.article_id AND ar.created_at > '1000-01-01'
            LEFT JOIN article_likes al ON ua.user_id = al.user_id AND ua.article_id = al.article_id AND al.created_at > '1000-01-01'
            LEFT JOIN scraps s ON ua.user_id = s.user_id AND ua.article_id = s.article_id AND s.created_at > '1000-01-01'
            GROUP BY ua.user_id, ua.article_id
            """
            cursor.execute(sql)#, (seven_days_ago, seven_days_ago, seven_days_ago))
            results = cursor.fetchall()
            df = pd.DataFrame(results)

            # ✅ interaction_score 컬럼 생성 (예: view + like + scrap + search 합산)
            df['interaction_score'] = (
                df['view_count'] +
                df['like_count'] +
                df['scrap_count']
            )

            return df
    finally:
        conn.close()

import joblib
import pickle
CANDIDATES_PATH = './models/candidate_articles.pkl'
LAST_UPDATE_PATH = './models/last_update.txt'
MODEL_PATH = './models/lda_model.pkl'
# 뉴스 기사 데이터 가져오기
def fetch_articles():
    db = get_mongodb_connection()
    articles = list(db.articles.find({}, {'_id': 1, 'article_id' : 1, 'title': 1, 'content': 1, 'category': 1, 'datetime': 1}))
    print("기사 개수 : ")
    print(len(articles))
    return pd.DataFrame(articles)


# Time Decay 계산 함수
def calculate_time_decay(timestamp, decay_factor=0.05):
    """
    Exponential Time Decay 계산 함수
    최신 데이터에 더 높은 가중치를 부여
    """
    # timestamp가 pandas.Timestamp이면 변환
    if isinstance(timestamp, pd.Timestamp):
        timestamp = timestamp.to_pydatetime()  # pandas.Timestamp -> datetime 변환

    elif isinstance(timestamp, str):
        # 문자열 포맷 변환 (ISO 8601 형식 처리)
        timestamp = datetime.fromisoformat(timestamp.replace("Z", "+00:00"))

    # 현재 시간과 차이 계산
    days_old = (datetime.now() - timestamp).days
    return np.exp(-decay_factor * days_old)

# def calculate_time_decay(timestamp, decay_factor=0.05):
#     """
#     Exponential Time Decay 계산 함수
#     최신 데이터에 더 높은 가중치를 부여
#     """
#     timestamp = datetime.strptime(timestamp.split(".")[0], "%Y-%m-%d %H:%M:%S")
#     days_old = (datetime.now() - timestamp).days
#     return np.exp(-decay_factor * days_old)


# 토픽 모델링 기반 후보군 추출 부분
def select_candidate_articles(articles):
    """
    토픽 모델링을 활용하여 추천 후보군을 선정하는 함수
    """
    db = get_mongodb_connection()
    start_time = time.perf_counter()
    # 기사 데이터 가져오기
    articles = articles.to_dict(orient='records')
    
    # 기사 ID와 텍스트 데이터 준비
    article_ids = [article['article_id'] for article in articles]
    texts = [f"{article['title']} {article['content']}" for article in articles]
    
    # 최근 기사에 가중치 부여를 위한 시간 정보
    pub_dates = [pd.to_datetime(article.get('datetime', datetime.now())) for article in articles]
        
    end_time = time.perf_counter()  # ⏱️ 실행 종료 시간 측정
    execution_time = end_time - start_time  # 실행 시간 계산

    print(f"⏳ 데이터 불러오는 시간: {execution_time:.4f}초")  # 소수점 4자리까지 출력


    # 1. 텍스트 전처리
    # 한국어 텍스트인 경우 형태소 분석 등 추가 전처리가 필요할 수 있음
    from sklearn.feature_extraction.text import CountVectorizer
    start_time = time.perf_counter()
    # 불용어 처리 및 벡터화
    vectorizer = CountVectorizer(
        max_df=0.95,  # 95% 이상 문서에 등장하는 단어 제외
        min_df=2,     # 최소 2개 이상 문서에 등장하는 단어만 포함
        max_features=5000,  # 최대 5000개 단어만 사용
        stop_words='english'  # 영어 불용어 제거 (한국어의 경우 별도 불용어 리스트 필요)
    )
    
    # 문서-단어 행렬 생성
    try:
        X = vectorizer.fit_transform(texts)
    except ValueError:
        logger.error("Failed to vectorize article texts. Check if texts are valid.")
        # 실패 시 인기 있는 기사로 대체
        return get_popular_articles(3000)
    
    end_time = time.perf_counter()  # ⏱️ 실행 종료 시간 측정
    execution_time = end_time - start_time  # 실행 시간 계산

    print(f"⏳ 단어 행렬 생성 실행 시간: {execution_time:.4f}초")  # 소수점 4자리까지 출력
    # 2. LDA 토픽 모델링 적용
    from sklearn.decomposition import LatentDirichletAllocation
    start_time = time.perf_counter()

    # 토픽 수 설정 (이 값은 실험적으로 조정 필요)
    n_topics = 20

    # LDA 모델 학습
    lda = LatentDirichletAllocation(
        n_components=n_topics,
        max_iter=10,
        learning_method='online',
        random_state=42,
        batch_size=128,
        n_jobs=-1  # 모든 CPU 코어 사용
    )

    try:
        # 문서-토픽 행렬 생성
        doc_topic_matrix = lda.fit_transform(X)
        joblib.dump(lda, MODEL_PATH)
        print(f"LDA 모델 저장됨: {MODEL_PATH}")
    except Exception as e:
        logger.error(f"LDA model fitting failed: {str(e)}")
        # 실패 시 인기 있는 기사로 대체
        return get_popular_articles(3000)
    
    # 3. 각 토픽별 상위 기사 선정
    top_articles_per_topic = {}
    
    # 각 토픽에 대한 기사의 관련도 점수
    for topic_idx in range(n_topics):
        # 해당 토픽에 대한 각 기사의 점수
        topic_scores = doc_topic_matrix[:, topic_idx]
        
        # 시간 가중치 적용 (최신 기사에 더 높은 가중치)
        time_weights = np.array([calculate_time_decay(pub_date) for pub_date in pub_dates])
        
        # 최종 점수 = 토픽 점수 * 시간 가중치
        final_scores = topic_scores * time_weights
        
        # 점수 기준 상위 기사 선정 (각 토픽별 100개, 전체 3000개를 채우기 위함)
        top_indices = np.argsort(final_scores)[::-1][:150]
        top_articles_per_topic[topic_idx] = [article_ids[idx] for idx in top_indices]
    
    # 4. 모든 토픽에서 선정된 기사 합치기
    candidate_articles = set()
    for topic_articles in top_articles_per_topic.values():
        candidate_articles.update(topic_articles)
    
    # 5. 최신 기사 추가 (지난 1일 이내)
    recent_articles = [
        article['article_id'] for article in articles
        if (datetime.now() - pd.to_datetime(article.get('datetime', datetime.now()))).days <= 1
    ]
    candidate_articles.update(recent_articles)
    
    end_time = time.perf_counter()  # ⏱️ 실행 종료 시간 측정
    execution_time = end_time - start_time  # 실행 시간 계산
    # 후보군 저장
    with open(CANDIDATES_PATH, 'wb') as f:
        pickle.dump(list(candidate_articles), f)
    print(f"후보 기사 저장됨: {CANDIDATES_PATH}")
    
    # 마지막 업데이트 시간 저장
    with open(LAST_UPDATE_PATH, 'w') as f:
        f.write(datetime.now().strftime("%Y-%m-%d %H:%M:%S"))
    print(f"⏳ 토픽 모델링 실행 시간: {execution_time:.4f}초")  # 소수점 4자리까지 출력
    return candidate_articles

# 인기도 기반으로 후보군 선정 (토픽 모델링 실패 시 대체용)
def get_popular_articles(n=3000):
    """
    사용자 상호작용 기반 인기 기사 선정 (기존 방식)
    """
    user_logs = fetch_user_interaction_logs()
    if user_logs.empty:
        return set()
    
    interaction_sum = user_logs['view_count'] + user_logs['like_count'] + user_logs['scrap_count'] + user_logs['search_count']
    user_logs['interaction_score'] = interaction_sum
    
    article_popularity = user_logs.groupby('article_id')['interaction_score'].sum().reset_index()
    article_popularity = article_popularity.sort_values('interaction_score', ascending=False)
    
    popular_articles = set(article_popularity.head(n)['article_id'].tolist())
    return popular_articles


import os

def get_cached_candidate_articles():
        # 저장된 후보군 불러오기
    if os.path.exists(CANDIDATES_PATH):
        with open(CANDIDATES_PATH, 'rb') as f:
            candidates = pickle.load(f)
            print(f"저장된 후보 기사 {len(candidates)}개를 불러왔습니다.")
            return candidates
    else:
        print("저장된 후보군이 없습니다. 인기 기사를 대신 사용합니다.")
        return get_popular_articles(3000)
    


# if __name__ == "__main__":
#     print(datetime.now(), " -------------- 추천 시작 --------------")
#     db = get_mongodb_connection()
#     logger.info("Starting recommendation calculation")
    
#     # 데이터 로드
#     user_logs = fetch_user_interaction_logs()
#     articles_df = fetch_articles()

#     # candidate_articles = select_candidate_articles(articles_df) -> 후보군 추출은 더 큰 배치에서 진행할 것
#     real_candidate = get_cached_candidate_articles()

#     unique_users = user_logs['user_id'].unique()
#     recommendations = {}
#     user_article_matrix = user_logs.pivot_table(
#             index='user_id', 
#             columns='article_id', 
#             values='interaction_score',
#             fill_value=0
#     )   
#     similarity_matrix = {}
#     for user_id in unique_users:
#         top_recommendations = []
#         user_data = user_logs[user_logs['user_id'] == user_id]    
#         # 사용자가 이미 상호작용한 기사 목록
#         user_articles = set(user_data['article_id'].tolist())
#             # 사용자 기반 협업 필터링
#             # 유사 사용자 찾기 (코사인 유사도 사용)
#             # 사용자-기사 인터랙션 행렬 생성 (가중치 적용)

#         if user_id in user_article_matrix.index:
#             user_vector = user_article_matrix.loc[user_id].values.reshape(1, -1)
            
#             # 다른 사용자들과의 유사도 계산
#             similarities = cosine_similarity(user_vector, user_article_matrix.values)[0]
            
#             # 유사도와 사용자 ID를 매핑
#             sim_users = list(zip(user_article_matrix.index, similarities))
#             sim_users.sort(key=lambda x: x[1], reverse=True)
            
#             # 상위 30명의 유사 사용자 선택 (자기 자신 제외)
#             sim_users = [(u, s) for u, s in sim_users if u != user_id][:3]
            
#             # 유사도 행렬에 저장
#             similarity_matrix[user_id] = similarities

#                 # 유사 사용자들이 좋아하는 기사 찾기
#             cf_scores = defaultdict(float)
                
#             for sim_user, similarity in sim_users:
#                     # 유사 사용자의 상호작용 데이터
#                 sim_user_data = user_logs[user_logs['user_id'] == sim_user]

#                 for _, row in sim_user_data.iterrows():
#                     article_id = row['article_id']
#                         # 이미 상호작용한 기사 제외 및 후보군으로 제한
#                     if article_id not in user_articles and article_id in real_candidate:
#                             # 시간 가중치 적용: 최근 상호작용일수록 더 큰 가중치
#                         time_weight = calculate_time_decay(row['last_interaction'])
#                         #print("aa", article_id)
#                             # 협업 필터링 점수 계산
#                         interaction_score = row['interaction_score']
#                         cf_scores[article_id] += float(similarity) * float(interaction_score) * float(time_weight)
                
#                 # 컨텐츠 기반 필터링 점수 계산
#             cb_scores = defaultdict(float)
                
#             for article_id in user_articles:
#                     # 사용자가 상호작용한 각 기사와 유사한 기사들 찾기
#                 similar_articles = list(db.similarity.find({'article_id': article_id}, {'similar_articles': 1}))
#                 #print(similar_articles)
#                 if similar_articles and 'similar_articles' in similar_articles[0]:
#                     for similar in similar_articles[0]['similar_articles']:
#                         similar_id = similar['article_id']
                            
#                             # 이미 상호작용한 기사 제외 및 후보군으로 제한
#                         if similar_id not in user_articles and similar_id in real_candidate:
#                             similarity_score = similar['similarity_score']
                                
#                                 # 기사 발행 시간에 따른 가중치 계산
#                             article_info = articles_df[articles_df['_id'] == similar_id]
#                             if not article_info.empty:
#                                 published_at = article_info.iloc[0]['published_at']
#                                 time_weight = calculate_time_decay(published_at)
                                    
#                                     # 컨텐츠 기반 점수 계산
#                                 cb_scores[similar_id] += float(similarity_score) * float(time_weight)
                
#                 # 두 점수 결합 (가중치 CF:CB = 7:3)
#             final_scores = {}
#             for article_id in set(list(cf_scores.keys()) + list(cb_scores.keys())):
#                 final_scores[article_id] = 0.7 * float(cf_scores.get(article_id, 0)) + 0.3 * float(cb_scores.get(article_id, 0))
                
#                 # 스코어 기준 상위 8개 기사 선택
#             top_recommendations = sorted(final_scores.items(), key=lambda x: x[1], reverse=True)[:35]

#     # 만약 8개 다 읽었던거라 뭐 그런 예외 발생하면 아예 인기순으로만 뿌려주는 방식으로 수정하기

#                 # 3. 인터리빙 - 탐색(Exploration) 위해 랜덤 기사 2개 추가
#                 # 모든 후보 기사 중에서 아직 추천되지 않은 기사 중 무작위 선택
#             recommended_ids = set(article_id for article_id, _ in top_recommendations)
#             exploration_candidates = [
#                 article_id for article_id in real_candidate 
#                 if article_id not in user_articles and article_id not in recommended_ids
#             ]
                
#             if exploration_candidates:
#                 random_articles = np.random.choice(
#                     exploration_candidates, 
#                     size=min(50 - len(top_recommendations), len(exploration_candidates)), 
#                     replace=False
#                 )
#                 for article_id in random_articles:
#                     top_recommendations.append((article_id, 0))  # 점수는 0으로 설정
#                 # 최종 추천 목록 저장
#             recommendations[user_id] = [article_id for article_id, _ in top_recommendations[:50]]
#         else:
#             popular_articles = get_popular_articles()
#                 # 새로운 사용자 또는 상호작용이 없는 사용자: 인기 기사 추천
#             recommendations[user_id] = list(popular_articles)[:50]


#         # MongoDB에 추천 결과 저장 / 업데이트
    
#     for user_id, recommended_articles in recommendations.items():

#             arr = np.array(recommended_articles, dtype=np.int32)
#             articles_list = [int(a) for a in arr]

#             collection = db["recommendation"]
#             result = collection.update_one(
#             {"user_id": int(user_id)},  # 찾을 조건
#             {"$set": {"articles": articles_list}},  # 필드 업데이트
#             upsert=True  # 없으면 새 문서 삽입
#             )

#         # 업데이트/삽입 결과 확인
#     if result.matched_count > 0:
#         print("-----", datetime.now(), "-----")
#         print("기존 문서가 업데이트되었습니다.")
#     else:
#         print("-----", datetime.now(), "-----")
#         print("새 문서가 삽입되었습니다.")


#     print(datetime.now(), " -------------- 추천 종료 --------------")


db = get_mongodb_connection()
collection = db["recommendation"]
result = collection.update_one(
            {"user_id": int(124)},  # 찾을 조건
            {"$set": {"articles": [19068, 19105, 28745, 23610, 12852, 29273, 29329, 28119, 23484, 28114, 29006, 23056, 406, 28746, 28203, 28494, 29360]}},  # 필드 업데이트
            upsert=True  # 없으면 새 문서 삽입
            )