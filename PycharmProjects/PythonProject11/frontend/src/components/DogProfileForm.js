import React, { useState } from "react";
import axios from "axios";

const DogProfileForm = () => {
  // 🔹 강아지 데이터 상태
  const [dog, setDog] = useState({
    name: "",
    age: "",
    ageUnit: "개월",
    breed: "",
    weight: "",
    weightUnit: "kg",
    health_issues: [],
    fitness_goal: [],
    image_path: ""
  });

  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState("");

  // 🔹 강아지 목록 조회 상태
  const [showList, setShowList] = useState(false); 
  const [dogProfiles, setDogProfiles] = useState([]);

  // 🔹 강아지 목록 보기 버튼 토글
  const toggleDogList = async () => {
    if (!showList) {
      await getDogProfiles(); // 목록 불러오기
    }
    setShowList(!showList);
  };

  // ✅ 강아지 목록 조회 (Flask API 호출)
  const getDogProfiles = async () => {
    try {
      const response = await axios.get("http://127.0.0.1:5000/api/dogs");
      setDogProfiles(response.data);
    } catch (error) {
      console.error("강아지 목록 불러오기 실패:", error);
    }
  };

  // 🔹 견종 목록 (일부만 표시)
  const breeds = ["골든 리트리버", "그레이트 데인", "그레이트 피레니즈", "기슈견",
    "닥스훈트", "달마시안", "도베르만 핀셔", "라사 압소", "래브라도 리트리버",
    "러프 콜리", "로트와일러", "마스티프", "말리노이즈", "말티즈",
    "바센지", "보더 콜리", "보르조이", "보스턴 테리어", "불 테리어",
    "불마스티프", "브리타니", "비글", "비즐라", "사모예드", "샤페이",
    "세인트 버나드", "셰퍼드", "스코티시 테리어", "스피츠", "시베리안 허스키",
    "시바견", "시츄", "아메리칸 불리", "아프간 하운드", "알래스칸 말라뮤트",
    "아이리시 세터", "아키타견", "웰시코기", "잉글리시 불도그", "잉글리시 코커 스파니엘",
    "이탈리안 그레이하운드", "잭 러셀 테리어", "진돗개", "차우차우", "치와와",
    "카네 코르소", "코카 스파니엘", "케언 테리어", "콜리", "티베탄 마스티프",
    "파라오 하운드", "파피용", "페키니즈", "포메라니안", "포인터",
    "포르투갈 워터 독", "푸들", "프렌치 불도그", "핏불 테리어"];

  // 🔹 건강 문제 목록 (일부만 표시)
  const healthIssues = ["관절 문제", "고관절 이형성증", "슬개골 탈구", "관절염", "골다공증", "디스크 질환",
    "심장 질환", "고혈압", "기관 협착증", "폐부종", "기관지염", "호흡곤란",
    "비만", "당뇨병", "갑상선 기능 저하증", "쿠싱 증후군", "애디슨병",
    "소화불량", "위염", "췌장염", "장염", "대장염", "과민성 대장 증후군", "위궤양",
    "피부 알러지", "습진", "피부 건조증", "탈모", "모낭충 감염", "귀 진드기"
];

  // 🔹 운동 목표 목록 (일부만 표시)
  const fitnessGoals = ["전신 근력 강화", "앞다리 근력 강화", "뒷다리 근력 강화", "코어 근력 강화",
    "체지방 감소", "지구력 향상", "심폐 기능 강화", "균형 감각 향상",
    "순발력 및 반응 속도 훈련", "재활 운동 (관절 보호)", "허리 디스크 예방",
    "고령견 관절 보호 운동", "수중 재활 운동", "수술 후 회복 운동"
];

  // ✅ 입력값 변경 핸들러
  const handleChange = (e) => {
    setDog({ ...dog, [e.target.name]: e.target.value });
  };

  // ✅ 건강 문제 선택 핸들러 (체크박스)
  const handleHealthIssuesChange = (issue) => {
    setDog((prev) => ({
      ...prev,
      health_issues: prev.health_issues.includes(issue)
        ? prev.health_issues.filter((i) => i !== issue)
        : [...prev.health_issues, issue],
    }));
  };

  // ✅ 운동 목표 선택 핸들러 (체크박스)
  const handleFitnessGoalsChange = (goal) => {
    setDog((prev) => ({
      ...prev,
      fitness_goal: prev.fitness_goal.includes(goal)
        ? prev.fitness_goal.filter((g) => g !== goal)
        : [...prev.fitness_goal, goal],
    }));
  };

  // ✅ 이미지 업로드 핸들러
  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("image", file);
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));

    try {
      const response = await axios.post("http://127.0.0.1:5000/api/upload_image", formData, {
        headers: { "Content-Type": "multipart/form-data" }
      });
      setDog({ ...dog, image_path: response.data.image_url });
    } catch (error) {
      console.error("이미지 업로드 실패:", error);
    }
  };

  // ✅ 이미지 삭제 핸들러
  const handleImageDelete = () => {
    setImageFile(null);
    setImagePreview("");
    setDog({ ...dog, image_path: "" });
  };

  // ✅ 폼 제출 핸들러 (Flask API로 데이터 전송)
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await axios.post("http://127.0.0.1:5000/api/add_dog", dog);
      alert("강아지 프로필이 저장되었습니다!");
      setDog({
        name: "",
        age: "",
        ageUnit: "개월",
        breed: "",
        weight: "",
        weightUnit: "kg",
        health_issues: [],
        fitness_goal: [],
        image_path: ""
      });
    } catch (error) {
      console.error("저장 실패:", error);
      alert("저장 중 오류가 발생했습니다.");
    }
  };

  return (
    <div style={styles.formContainer}>
      {/* 🔹 강아지 등록 폼 */}
      <div style={styles.formSection}>
        <h2>🐶 강아지 정보 입력</h2>
        <form style={styles.form} onSubmit={handleSubmit}>
          <div style={styles.inputGroup}>
            <label>이름:</label>
            <input type="text" name="name" value={dog.name} onChange={handleChange} style={styles.nameInput} required />
          </div>

          <div style={styles.inputGroup}>
            <label>나이:</label>
            <div style={styles.inlineGroup}>
              <input type="number" name="age" value={dog.age} onChange={handleChange} style={styles.smallInput} required />
              <select name="ageUnit" onChange={handleChange} value={dog.ageUnit} style={styles.selectInput}>
                <option value="개월">개월</option>
                <option value="년">년</option>
              </select>
            </div>
          </div>

          <div style={styles.inputGroup}>
            <label>견종:</label>
            <select name="breed" value={dog.breed} onChange={handleChange} style={styles.selectInput} required>
              <option value="">견종 선택</option>
              {breeds.map((breed, index) => (
                <option key={index} value={breed}>{breed}</option>
              ))}
            </select>
          </div>

           {/* 체중 입력 */}
        <div style={styles.inputGroup}>
          <label>체중:</label>
          <div style={styles.inlineGroup}>
            <input type="number" name="weight" value={dog.weight} onChange={handleChange} style={styles.smallInput} required />
            <select name="weightUnit" onChange={handleChange} value={dog.weightUnit} style={styles.selectInput}>
              <option value="kg">kg</option>
              <option value="g">g</option>
            </select>
          </div>
        </div>

         {/* ✅ 건강 문제 체크리스트 (체중 밑으로 이동됨) */}
         <div style={styles.inputGroup}>
          <label>건강 문제:</label>
          <div style={styles.checkboxContainer}>
            {healthIssues.map((issue, index) => (
              <label key={index} style={styles.checkboxLabel}>
                <input type="checkbox" checked={dog.health_issues.includes(issue)} onChange={() => handleHealthIssuesChange(issue)} />
                {issue}
              </label>
            ))}
          </div>
        </div>

        {/* ✅ 운동 목표 체크리스트 (체중 밑으로 이동됨) */}
        <div style={styles.inputGroup}>
          <label>운동 목표:</label>
          <div style={styles.checkboxContainer}>
            {fitnessGoals.map((goal, index) => (
              <label key={index} style={styles.checkboxLabel}>
                <input type="checkbox" checked={dog.fitness_goal.includes(goal)} onChange={() => handleFitnessGoalsChange(goal)} />
                {goal}
              </label>
            ))}
          </div>
        </div>

          {/* 🔹 등록 버튼 */}
          <button type="submit" style={styles.submitButton}>등록</button>
        </form>
      </div>

      {/* 🔹 강아지 사진 업로드 */}
      <div style={styles.imageUploadContainer}>
        <label>강아지 사진:</label>
        {imagePreview ? (
          <div style={styles.imagePreviewContainer}>
            <img src={imagePreview} alt="Uploaded" style={styles.imagePreview} />
            <button type="button" onClick={handleImageDelete} style={styles.deleteButton}>삭제</button>
          </div>
        ) : (
          <input type="file" accept="image/*" onChange={handleImageUpload} />
        )}
      </div>

      {/* 🔹 강아지 목록 조회 버튼 */}
      <button onClick={toggleDogList} style={styles.toggleButton}>
        {showList ? "🐾 목록 숨기기" : "📋 강아지 목록 보기"}
      </button>

      {/* 🔹 강아지 목록 */}
      {showList && (
        <div style={styles.listContainer}>
          {dogProfiles.map((dog) => (
            <div key={dog.id} style={styles.dogCard}>
              <h3>{dog.name} ({dog.age} {dog.ageUnit})</h3>
              <p>🐶 {dog.breed}</p>
              {dog.image_path && <img src={dog.image_path} alt="강아지 사진" style={styles.listImage} />}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

const styles = {
  // 🔹 전체 폼 컨테이너 (입력 폼 + 이미지 업로드 영역)
  formContainer: { 
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    gap: "20px",
    padding: "20px",
    maxWidth: "750px",
    margin: "auto",
    backgroundColor: "#f9f9f9",
    borderRadius: "20px",
    boxShadow: "0px 0px 10px rgba(0,0,0,0.1)"
  },

  // 🔹 입력 폼 섹션 (왼쪽 영역)
  formSection: { 
    flex: 2,
    display: "flex",
    flexDirection: "column",
    gap: "10px"
  },

  // 🔹 이미지 업로드 섹션 (오른쪽 영역)
  imageUploadContainer: { 
    flex: 1.2,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    alignSelf: "center"
  },

  // 🔹 이미지 미리보기 스타일
  imagePreviewContainer: { 
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: "10px"
  },
  imagePreview: { 
    width: "200px",
    height: "200px",
    objectFit: "cover",
    borderRadius: "10px"
  },

  // 🔹 삭제 버튼 스타일
  deleteButton: { 
    backgroundColor: "#ff4444",
    color: "white",
    border: "none",
    padding: "5px 10px",
    borderRadius: "5px",
    cursor: "pointer"
  },

  // 🔹 입력 필드 (이름, 나이 등)
  nameInput: { 
    width: "40%",
    maxWidth: "200px",
    padding: "6px",
    fontSize: "14px",
    borderRadius: "10px",
    border: "1px solid #ccc"
  },
  smallInput: { 
    width: "80px",
    padding: "6px",
    fontSize: "14px",
    borderRadius: "5px",
    border: "1px solid #ccc"
  },

  // 🔹 드롭다운 (견종 선택, 체중 단위 선택 등)
  selectInput: { 
    width: "auto",
    maxWidth: "130px",
    padding: "6px",
    fontSize: "14px",
    borderRadius: "5px",
    border: "1px solid #ccc"
  },

  // 🔹 체크리스트 (건강 문제, 운동 목표)
  checkboxContainer: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "8px",
    maxHeight: "80px",
    overflow: "auto",
    backgroundColor: "#fff",
    padding: "8px",
    borderRadius: "5px",
    border: "1px solid #ccc"
  },
  checkboxLabel: { 
    display: "flex",
    alignItems: "center",
    gap: "5px"
  },

  // 🔹 등록 버튼
  submitButton: { 
    padding: "10px",
    backgroundColor: "#28a745",
    color: "white",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
    fontSize: "14px"
  },

  // 🔹 강아지 목록 조회 버튼 (추가됨)
  toggleButton: {
    padding: "10px 15px",
    backgroundColor: "#007bff",  // 파란색 버튼
    color: "white",
    border: "none",
    borderRadius: "5px",
    fontSize: "14px",
    cursor: "pointer",
    marginTop: "15px",
    display: "block",
    width: "100%",
    maxWidth: "200px",
    textAlign: "center"
  },

  // 🔹 강아지 목록 컨테이너
  listContainer: {
    marginTop: "20px",
    padding: "10px",
    backgroundColor: "#f1f1f1",
    borderRadius: "10px",
    maxWidth: "750px",
    margin: "auto"
  },

  // 🔹 개별 강아지 카드
  dogCard: {
    padding: "10px",
    borderBottom: "1px solid #ccc",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    textAlign: "center"
  },

  // 🔹 강아지 목록 내 이미지 스타일
  listImage: {
    width: "100px",
    height: "100px",
    objectFit: "cover",
    borderRadius: "10px"
  }
};


export default DogProfileForm;
