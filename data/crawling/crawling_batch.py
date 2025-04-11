import requests
from bs4 import BeautifulSoup
from tqdm.notebook import tqdm
from datetime import datetime, timedelta
import re
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.common.keys import Keys
from selenium.webdriver.chrome.service import Service
from webdriver_manager.chrome import ChromeDriverManager
import time
import json
import konlpy
from krwordrank.word import summarize_with_keywords
from konlpy.tag import Okt
from krwordrank.word import KRWordRank
import pymongo
from pymongo import MongoClient, ReturnDocument
import pickle
from collections import deque
def extract_minutes_ago(article):
    """HTML에서 'n분 전' 추출하여 datetime 반환 (1~10분 사이만 유효)"""
    time_tag = article.find("div", class_="sa_text_datetime is_recent")  
    if not time_tag:
        return None
    
    time_text = time_tag.text.strip()
    now = datetime.utcnow()  # 현재 시간 (UTC 기준)

    # "n분 전" 형태 처리
    minutes_ago_match = re.search(r'(\d+)분전', time_text)
    if minutes_ago_match:
        minutes_ago = int(minutes_ago_match.group(1))
        if 1 <= minutes_ago <= 20:  # 1~10분 전 기사만 유효
            return now - timedelta(minutes=minutes_ago)
    
    return None  # 10분 초과 기사는 제외


def ex_tag(sid):
    # Selenium 웹 드라이버 설정
    driver = webdriver.Chrome(service=Service(ChromeDriverManager().install()))
    url = f"https://news.naver.com/breakingnews/section/105/{sid}"
    driver.get(url)

    soup = BeautifulSoup(driver.page_source, "lxml")
    a_tags = soup.find_all("div", class_="sa_text")  # 기사 div 요소 가져오기
    article_list = []
    for article in a_tags:
        a_tag = article.find("a", class_="sa_text_title _NLOG_IMPRESSION")
        if not a_tag:
            continue

        imp_url = a_tag.get("href")
        article_time = extract_minutes_ago(article)  # 게시 시간 추출

        if imp_url and article_time:
            article_list.append({"url": imp_url, "datetime": article_time})
        # 드라이버 종료
    driver.quit()
    return article_list


def ex_tag_for_day(sid, date):
    # Selenium 웹 드라이버 설정
    driver = webdriver.Chrome(service=Service(ChromeDriverManager().install()))
    url = f"https://news.naver.com/breakingnews/section/105/{sid}?date={date}"
    driver.get(url)
    
    # 페이지 로딩 대기 (최초 로딩 2초 대기)
    time.sleep(2)
    
    # "기사 더보기" 버튼 클릭 (페이지 하단까지 스크롤)
    while True:
        try:
            # 더보기 버튼 클릭
            load_more_button = driver.find_element(By.CSS_SELECTOR, "a.section_more_inner._CONTENT_LIST_LOAD_MORE_BUTTON")
            load_more_button.click()
            time.sleep(2)  # 버튼 클릭 후 잠시 대기
        except Exception as e:
            # 더보기 버튼이 없으면 (즉, 더 이상 로드할 기사가 없으면) 반복문 종료
            print("더 이상 기사가 없습니다.")
            break
    
    # 페이지 소스를 가져와서 BeautifulSoup으로 파싱
    soup = BeautifulSoup(driver.page_source, "lxml")
    a_tag = soup.find_all("a", class_="sa_text_title _NLOG_IMPRESSION")
    
    tag_lst = []
    print(len(a_tag))  # 전체 기사 개수 확인
    for a in a_tag:
        imp_url = a.get("data-imp-url") 
        if imp_url:  # href가 있는 것만 고르는 것
            tag_lst.append({"url": imp_url})  # 리스트에 추가
            # print(imp_url)  # 확인용 출력
    
    # 드라이버 종료
    driver.quit()
    
    return tag_lst



def art_crawl(all_hrefs, category_idx, index):

    url = all_hrefs[category_idx][index]['url']
    html = requests.get(url, headers = {"User-Agent": "Mozilla/5.0 "\
    "(Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko)"\
    "Chrome/110.0.0.0 Safari/537.36"})
    soup = BeautifulSoup(html.text, "lxml")
    if html.status_code != 200:
        print(f"IP 차단 감지: {html.status_code}")


    # -------------------------------------- DATA 추출 --------------------------------------

    # 뉴스 제목 추출
    title_tag = soup.find("meta", property="og:title")
    news_title = ""
    if title_tag is not None:
        news_title = title_tag["content"] if title_tag else soup.find("h2", class_="media_end_head_headline").text.strip()

    # 뉴스 본문 추출
    article_body = soup.find("article", id="dic_area")
    news_content = ""
    if article_body is not None:
        news_content = article_body.get_text(separator="\n").strip()

    summary = ""
    if article_body:
    # 요약 부분 추출 (있을 경우)
        summary_tag = article_body.find("strong", class_="media_end_summary")
        summary = summary_tag.get_text(strip=True) if summary_tag else None

        # 본문 내용에서 요약 부분 제거
        if summary_tag:
            summary_tag.extract()  # summary_tag를 제거하여 본문에 포함되지 않도록 함

        # 나머지 본문 내용 추출 (텍스트만 가져오기)
        news_content = article_body.get_text(separator="\n", strip=True)

        #print("📌 요약:", summary)
        #print("\n📌 본문:", content)

    # 뉴스 이미지 리스트 추출
    #image_tags = soup.find_all("meta", property="og:image")

    # 여러 개의 이미지 데이터를 저장할 리스트
    image_data = []

    # 모든 end_photo_org 태그 찾기
    photo_tags = soup.find_all("span", class_="end_photo_org")
    #print(f"photo tag 개수: {len(photo_tags)}")
    for photo_tag in photo_tags:
        # 이미지 태그 찾기
        img_tag = photo_tag.find("img")
        #print(img_tag)
        img_url = img_tag["data-src"] if img_tag else None  # 이미지가 없는 경우 대비
        #print(f"url: {img_url}")
        # 이미지 설명 태그 찾기 (없을 수도 있음)
        desc_tag = photo_tag.find("em", class_="img_desc")
        img_desc = desc_tag.get_text(strip=True) if desc_tag else None  # 설명이 없는 경우 None
        #print(f"설명: {img_desc}")
        # 유효한 이미지 데이터만 리스트에 추가
        if img_url:
            image_data.append({"image_url": img_url, "image_desc": img_desc})


    news_images = []
    # img_list.append()
    # 뉴스 작성 시간 추출
    date_tag = soup.find('span', class_='media_end_head_info_datestamp_time _ARTICLE_DATE_TIME')
    date_time = ""
    if date_tag is not None:
        date_time = date_tag['data-date-time']
    # 기자 이름 추출
    reporter_tag = soup.find('em', class_='media_end_head_journalist_name')
    reporter_name = ""
    if reporter_tag is not None:
        reporter_name = reporter_tag.text.strip()
        
    # 언론사 이름 추출
    media_tag = soup.find("a", class_="media_end_head_top_logo")
    media_name = media_tag.find("img", class_="media_end_head_top_logo_img")["alt"] if media_tag else ""
    # print(media_name)
    journal = ""
    # print("📌 제목:", news_title)
    # print("📌 언론사:", journal)
    # print("📌 기자:", reporter_name)
    # print("📌 날짜:", date_time)
    # print("📌 요약:", summary)
    # print("\n📌 본문:", news_content)
    # print("\n 이미지 개수: ", len(image_data))
    if media_name is not None:
        journal = media_name     
    return news_title, news_content, image_data, date_time, reporter_name, journal, summary

category_id = [731, 226, 227, 230, 732, 283, 229] # 모바일, 인터넷/SNS, 통신/뉴미디어, IT 일반, 보안/해킹, 컴퓨터, 게임/리뷰
category = ["모바일", "SNS", "통신", "IT 일반", "보안", "AI", "게임"]


def ext_keyword(cur_text):
#     t = Okt()
#     content_tokens = t.morphs(cur_text) # 기사 키워드 추출
#     print(len(content_tokens))

# 키워드 빈도수 포함해서 뽑아내는 방식

    min_count = 1   # 단어의 최소 출현 빈도수 (그래프 생성 시)
    max_length = 10 # 단어의 최대 길이
    wordrank_extractor = KRWordRank(min_count=min_count, max_length=max_length)
    beta = 0.85    # PageRank의 decaying factor beta
    max_iter = 20
    #print("start")
    keywords, rank, graph = wordrank_extractor.extract([cur_text], beta, max_iter)
    #print(len(keywords))

    # 키워드를 점수에 따라 내림차순 정렬하고 상위 50개만 선택
    sorted_keywords = sorted(keywords.items(), key=lambda x: x[1], reverse=True)
    top_keywords = sorted_keywords[:50]
    
    # 각 키워드를 딕셔너리 형태로 변환 (예: {"word": "키워드", "score": 점수})
    keyword_list = [{"word": word, "score": r} for word, r in top_keywords]
    
    # JSON 형식의 데이터 생성 (필요 시 다른 필드와 함께 확장 가능)

    return keyword_list


def get_next_sequence(db, name):
    counter = db.counters.find_one_and_update(
        {"_id": name},
        {"$inc": {"seq": 1}},
        return_document = ReturnDocument.AFTER,
        upsert=True
    )
    return counter["seq"]


def to_save(cur_title, cur_text, cur_images, cur_keyword, category_idx, date_time, reporter, journal, summary):


    # MongoDB 연결 (기본 로컬호스트 사용, 필요시 연결 문자열 수정)
    client = MongoClient("mongodb+srv://S12P21B201:KqdHQ58L81@ssafy.ngivl.mongodb.net/S12P21B201?authSource=admin")
    db = client["S12P21B201"]           # 사용할 데이터베이스 이름 

    collection = db["articles"]      # 사용할 컬렉션 이름
        

    article_id = get_next_sequence(db, "article_id")
    news_data = {
            "article_id" : article_id,
            "title": cur_title,
            "journal": journal,
            "summary": summary,
            "reporter": reporter,
            "datetime" : date_time,
            "category": category[category_idx],
            "content": cur_text,
            "images": cur_images,
            "quiz_generated": False,
            "quizzes": [],
            "correctness": "",
            "keywords": cur_keyword, 
        }
    
    collection.insert_one(news_data)
    return news_data

# MongoDB 연결 설정
client = MongoClient("mongodb+srv://S12P21B201:KqdHQ58L81@ssafy.ngivl.mongodb.net/S12P21B201?authSource=admin")
db = client["S12P21B201"]     
articles_collection = db["articles"]

# 최초 실행: 최신 1000개 가져와서 deque에 저장
def initialize_articles():
    articles = list(articles_collection.find()
                    .sort("article_id", -1)
                    .limit(10000))
    dq = deque(articles, maxlen=10000)
    with open("articles_10000.pkl", "wb") as f:
        pickle.dump(dq, f)
    print("초기 10000개 저장 완료")

# 주기적 업데이트: 10분마다 새 데이터 추가 & 오래된 데이터 제거
def update_articles(new_articles):
        # articles.pkl 불러오기
    with open("articles_10000.pkl", "rb") as f:
        dq = pickle.load(f)

    if new_articles:
        print(f"{len(new_articles)}개 새 기사 발견, 갱신 중")
        for article in new_articles:
            dq.append(article)  # maxlen=1000 이므로 자동으로 오래된 것부터 삭제됨
            # 업데이트된 deque 저장
        with open("articles_10000.pkl", "wb") as f:
                pickle.dump(dq, f)
    else:
        print("새로운 기사 없음")

from pymongo import MongoClient
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
import numpy as np
import time
import pandas as pd
# 🔹 MongoDB 연결
client = MongoClient("mongodb+srv://S12P21B201:KqdHQ58L81@ssafy.ngivl.mongodb.net/S12P21B201?authSource=admin")
db = client["S12P21B201"]           # 사용할 데이터베이스 이름 

# 🔹 모든 기사 가져오기
def fetch_all_articles_from_deque():
    # articles.pkl에서 deque 불러오기
    with open("articles_10000.pkl", "rb") as f:
        dq = pickle.load(f)
    
    # deque에서 article 목록 반환
    return list(dq)

def calculate_similarity(articles):
    # 1️⃣ 모든 기사에서 등장한 키워드 집합(어휘 목록) 생성
    vocab = set()
    for article in articles:
        for kw in article["keywords"]:
            vocab.add(kw["word"])
    
    vocab = sorted(list(vocab))  # 일관성을 위해 정렬
    word_to_index = {word: i for i, word in enumerate(vocab)}  # 키워드 → 인덱스 매핑

    # 2️⃣ 기사별 가중치 벡터 생성 (Sparse Matrix)
    article_vectors = np.zeros((len(articles), len(vocab)))

    for i, article in enumerate(articles):
        for kw in article["keywords"]:
            word = kw["word"]
            score = kw["score"]  # 키워드 가중치 사용
            if word in word_to_index:
                article_vectors[i, word_to_index[word]] = score  # 가중치 적용

    # 3️⃣ 코사인 유사도 계산
    similarity_matrix = cosine_similarity(article_vectors)
    return similarity_matrix

# 🔹 유사도 결과를 MongoDB에 저장
def save_similarity(articles, similarity_matrix, cur_id, cnt, top_n=10, threshold=0.3):
    # `cur_id` 이후의 기사만 처리

    # 새롭게 추가된 cnt만큼의 기사에 대해서만 유사도 저장
    for i, article in enumerate(articles):
        article_id = article["article_id"]
        #print(article_id, "번 기사-----")
        sim_scores = similarity_matrix[i]

        # ✅ 자기 자신 제외하고 유사도가 0.9 미만인 기사 중에서 상위 N개 선택
        similar_articles = []
        for j in np.argsort(sim_scores)[::-1]:  # 유사도 순으로 정렬
            if i != j:  # 자기 자신 제외, threshold 보다 유사도가 큰 경우만
                similar_articles.append({
                    "article_id": articles[j]["article_id"],  # 해당 기사에서 article_id 가져오기
                    "similarity_score": float(sim_scores[j])
                })
        
        # 상위 N개만 저장
        similar_articles = similar_articles[:top_n]

        # ✅ MongoDB에 저장
        if article_id > cur_id:
            #print(article_id, "는 저장완료")
            db.similarity.update_one(
            {"article_id": article_id},  # 해당 기사 ID가 이미 존재하는지 확인
            {"$set": {"similar_articles": similar_articles}},  # 있으면 업데이트
            upsert=True  # 없으면 새로 삽입
        )
        

    print("✅ 유사도 저장 완료")

import pandas as pd
import numpy as np

def save_similarity_matrix_to_csv(similarity_matrix, file_name="similarity_matrix.csv"):
    # similarity_matrix를 pandas DataFrame으로 변환
    df_similarity = pd.DataFrame(similarity_matrix)
    
    # DataFrame을 CSV로 저장
    df_similarity.to_csv(file_name, index=False, header=False)
    
    print(f"✅ 유사도 매트릭스가 '{file_name}'로 저장되었습니다.")


# 🔹 실행 함수
def run_similarity_update(cur_id, cnt):

    print("🔍 기사 데이터 로딩 중...")
    articles = fetch_all_articles_from_deque()
    
    if len(articles) < 2:
        print("❌ 유사도를 계산할 기사가 부족합니다.")
        return

    print("🧠 유사도 계산 중...")
    similarity_matrix = calculate_similarity(articles)
    
    #save_similarity_matrix_to_csv(similarity_matrix)  # CSV로 저장

    print("💾 유사도 저장 중...")
    save_similarity(articles, similarity_matrix, cur_id, cnt)

    print("🚀 모든 유사도 업데이트 완료!")




client = MongoClient("mongodb+srv://S12P21B201:KqdHQ58L81@ssafy.ngivl.mongodb.net/S12P21B201?authSource=admin")
db = client["S12P21B201"]           # 사용할 데이터베이스 이름 

def get_current_sequence(db, name):
    counter = db.counters.find_one({"_id": name})
    return counter["seq"] if counter else None


def main():
    start_time = time.perf_counter()
    org_link = []
    for id in category_id:
        org_link.append(ex_tag(id))
        #org_link.append(ex_tag_for_day(id, "20250411"))
    # 데이터 크롤링 완료

    all_data = []
    cnt = 0

    cur_id = get_current_sequence(db, "article_id")
    print("시작 id: ", cur_id)
    for i in (range(7)):
        for j in (range(len(org_link[i]))):
            cur_title, cur_text, cur_images, date_time, reporter, journal, summary = art_crawl(org_link, i, j)
            if cur_text != "":
                cur_keyword = ext_keyword(cur_text)
                data = to_save(cur_title, cur_text, cur_images, cur_keyword, i, date_time, reporter, journal, summary) # 여기서 이미 데이터 가져오면서 counters가 증가 (article_id 자동 증가 용도)
                all_data.append(data)
                # 배치에 데이터 추가
                cnt += 1

    update_articles(all_data) # 새로 크롤링한 데이터를 articles_5000에 추가하는 로직
    run_similarity_update(cur_id, cnt)# 2000개끼리만 유사도 계산 -> 새로 크롤링한 데이터들만 similarity 컬렉션에 유사도 저장
    end_time = time.perf_counter()  # ⏱️ 실행 종료 시간 측정
    execution_time = end_time - start_time  # 실행 시간 계산

    print(f"⏳ 실행 시간: {execution_time:.4f}초")  # 소수점 4자리까지 출력

print(datetime.now(), " -------------- 크롤링 시작 --------------")
main()
print(datetime.now(), " -------------- 크롤링 종료 --------------")