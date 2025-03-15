from flask import Flask, request, jsonify
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS
import os
from werkzeug.utils import secure_filename

# 1️⃣ Flask 애플리케이션 설정
app = Flask(__name__)
CORS(app)  # CORS 활성화 (React 연동을 위해 필요)

# 2️⃣ 데이터베이스 설정 (SQLite)
BASE_DIR = os.path.abspath(os.path.dirname(__file__))
app.config["SQLALCHEMY_DATABASE_URI"] = f"sqlite:///{os.path.join(BASE_DIR, 'dog_fitness.db')}"
app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False

# 3️⃣ SQLAlchemy 객체 생성
db = SQLAlchemy(app)

# 4️⃣ 이미지 업로드 폴더 설정
UPLOAD_FOLDER = "static/uploads"
app.config["UPLOAD_FOLDER"] = UPLOAD_FOLDER
os.makedirs(UPLOAD_FOLDER, exist_ok=True)  # 폴더 자동 생성

# 5️⃣ 강아지 프로필 모델 정의
class DogProfile(db.Model):
    __tablename__ = "dog_profiles"

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(50), nullable=False)
    age = db.Column(db.Integer, nullable=False)
    age_unit = db.Column(db.String(10), nullable=False)  # 개월 or 년
    breed = db.Column(db.String(50), nullable=False)
    weight = db.Column(db.Float, nullable=False)
    weight_unit = db.Column(db.String(10), nullable=False)  # kg or g
    health_issues = db.Column(db.Text, nullable=True)  # JSON 형태로 저장 가능
    fitness_goal = db.Column(db.Text, nullable=False)  # JSON 형태로 저장 가능
    equipment = db.Column(db.Text, nullable=True)  # JSON 형태로 저장 가능
    image_path = db.Column(db.String(255), nullable=True)  # 이미지 경로 저장

# 6️⃣ 데이터베이스 테이블 생성
with app.app_context():
    db.create_all()

# 7️⃣ 기본 API (서버 상태 확인)
@app.route("/")
def home():
    return "🐶 Dog Fitness API is running!"

# 8️⃣ 강아지 프로필 추가 API
@app.route("/api/add_dog", methods=["POST"])
def add_dog():
    data = request.json
    image_path = data.get("image_path", "")

    new_dog = DogProfile(
        name=data["name"],
        age=data["age"],
        age_unit=data["ageUnit"],
        breed=data["breed"],
        weight=data["weight"],
        weight_unit=data["weightUnit"],
        health_issues=",".join(data.get("health_issues", [])),  # 리스트 -> 문자열 변환
        fitness_goal=",".join(data.get("fitness_goal", [])),
        equipment=",".join(data.get("equipment", [])),
        image_path=image_path  # 이미지 경로 추가
    )

    db.session.add(new_dog)
    db.session.commit()

    return jsonify({"message": "✅ 강아지 프로필이 성공적으로 저장되었습니다!"})

# 9️⃣ 강아지 목록 조회 API
@app.route("/api/get_dogs", methods=["GET"])
def get_dogs():
    dogs = DogProfile.query.all()
    dog_list = [
        {
            "id": dog.id,
            "name": dog.name,
            "age": dog.age,
            "age_unit": dog.age_unit,
            "breed": dog.breed,
            "weight": dog.weight,
            "weight_unit": dog.weight_unit,
            "health_issues": dog.health_issues.split(",") if dog.health_issues else [],
            "fitness_goal": dog.fitness_goal.split(",") if dog.fitness_goal else [],
            "equipment": dog.equipment.split(",") if dog.equipment else [],
            "image_path": dog.image_path
        }
        for dog in dogs
    ]
    return jsonify(dog_list)

# 🔟 운동 추천 API
@app.route("/api/recommend-exercise", methods=["POST"])
def recommend_exercise():
    data = request.json
    health_issues = data["health_issues"]
    fitness_goal = data["fitness_goal"]

    # 운동 추천 리스트
    exercises = {
        "유산소": ["러닝머신 걷기", "지그재그 달리기"],
        "근력 강화": ["푸쉬업", "짐볼 플랭크"],
        "균형 감각": ["밸런스 패드 스탠드", "플란체 바 이동"],
    }

    # 건강 상태에 따른 맞춤 운동 추천
    if "관절 문제" in health_issues:
        recommended = ["수중 러닝", "소프트 서페이스 트레이닝"]
    elif "비만" in health_issues:
        recommended = ["러닝머신 걷기", "장거리 산책"]
    else:
        recommended = exercises.get(fitness_goal, ["기본 스트레칭"])

    return jsonify({"recommended_exercises": recommended})

# 1️⃣1️⃣ 강아지 이미지 업로드 API
@app.route("/api/upload_image", methods=["POST"])
def upload_image():
    if "image" not in request.files:
        return jsonify({"error": "이미지 파일이 없습니다."}), 400

    file = request.files["image"]
    if file.filename == "":
        return jsonify({"error": "파일 이름이 비어 있습니다."}), 400

    filename = secure_filename(file.filename)
    file_path = os.path.join(app.config["UPLOAD_FOLDER"], filename)
    file.save(file_path)  # 서버에 이미지 저장

    return jsonify({"image_url": f"/static/uploads/{filename}"})  # 저장된 이미지 경로 반환

# 1️⃣2️⃣ 서버 실행
if __name__ == "__main__":
    app.run(debug=True)
