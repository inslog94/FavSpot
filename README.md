# FavSpot

## 🌟 프로젝트 소개 🌟

```
💡 Favorite + Spot의 합성어로, 지도 API와 연동하여 자신이 좋아하는 장소를 보드에 담아 다른 사용자들과 공유하고 소통할 수 있는 웹/모바일 어플리케이션입니다.
```

* 🗺 지도에서 마음에 드는 장소를 골라 보드에 저장하고, 해당 장소에 대한 사진과 짧은 글을 남길 수 있습니다.
* 🔖 보드에 태그를 추가할 수 있고, 태그 기준으로 보드 검색이 가능합니다.
* 💛 보드를 구경하다가 마음에 드는 보드에 좋아요를 등록하거나, 댓글을 남길 수 있습니다.

### [목차]
1. [Collaborators](#1-👨‍💻-collaborators)
2. [개발환경](#2-💻-개발환경)
3. [협업 및 프로젝트 관리](#3-🤝-협업-및-프로젝트-관리)
4. [일일 회의](#4-🙋‍♂️-일일-회의)
5. [BE 프로젝트 구조](#5-📁-be-프로젝트-구조)
6. [프로젝트 기획(마인드맵)](#6-🧠-프로젝트-기획마인드맵)
7. [데이터베이스 설계](#7-🗃️-데이터베이스-설계)
8. [[BE] URL / Method 기능 설계](#8-🔧-be-url--method-기능-설계)
9. [[FE] 페이지 구상 및 기능 설계](#9-🔧-fe-페이지-구상-및-기능-설계)
10. [샘플 이미지](#10-🗺-샘플-이미지)
<br><br>

## 1. 👨‍💻 Collaborators
| 전영인 [inslog94@gmail.com] | 이영 [2young020@gmail.com] | 이철우 [chwoo9528@gmail.com] | 신태우 [kwixs35@gmail.com] |
|:----------------------------:|:----------------------------:|:----------------------------:|:----------------------------:|
| 🙍‍♂️ User 관련 기능<br>🔗[GitHub](https://github.com/inslog94) | 🗂 Board CRUD 관련 기능<br>🔗[GitHub](https://github.com/2zero0) | 📍 Pin CRUD 관련 기능<br>🔗[GitHub](https://github.com/bloodsteelrain) | 🗺 Map 관련 기능<br>🔗[GitHub](https://github.com/hansanhha) |
<br>

## 2. 💻 개발환경
#### 가상 환경 및 의존성 관리
<img src="https://img.shields.io/badge/poetry-60A5FA?style=for-the-badge&logo=poetry&logoColor=white">

#### FrontEnd
<img src="https://img.shields.io/badge/html5-E34F26?style=for-the-badge&logo=html5&logoColor=white"><img src="https://img.shields.io/badge/css-1572B6?style=for-the-badge&logo=css3&logoColor=white"><img src="https://img.shields.io/badge/javascript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black"><img src="https://img.shields.io/badge/bootstrap-7952B3?style=for-the-badge&logo=bootstrap&logoColor=white">

#### BackEnd
<img src="https://img.shields.io/badge/django-092E20?style=for-the-badge&logo=django&logoColor=white"><img src="https://img.shields.io/badge/python-3776AB?style=for-the-badge&logo=python&logoColor=white">

#### DaatBase 및 Cloud Storage
<img src="https://img.shields.io/badge/postgresql-4169E1?style=for-the-badge&logo=postgresql&logoColor=white"><img src="https://img.shields.io/badge/amazon s3-569A31?style=for-the-badge&logo=amazons3&logoColor=white">

#### 서비스 배포 환경
<img src="https://img.shields.io/badge/amazon lightsail-FF9900?style=for-the-badge&logo=amazonaws&logoColor=white"><img src="https://img.shields.io/badge/docker-2496ED?style=for-the-badge&logo=docker&logoColor=white"><img src="https://img.shields.io/badge/nginx-009639?style=for-the-badge&logo=nginx&logoColor=white">
<br><br>

## 3. 🤝 협업 및 프로젝트 관리
| Purpose | Tool |
| :------------: | :-------------: |
| 프로젝트 설계 | 🔗[Miro](https://miro.com/app/board/uXjVMtD8oGQ=/) |
| 프로젝트 관리 | 🔗[GitHub Project](https://github.com/users/inslog94/projects/3) |
| 이슈 관리 | 🔗[GitHub Issues](https://github.com/inslog94/FavSpot/issues) |
| 문서화 | 🔗[GitHub Wiki](https://github.com/inslog94/FavSpot/wiki) |
| 소통 | Discord |
<br>

## 4. 🙋‍♂️ 일일 회의
매일 아침, 저녁으로 회의를 진행하여 개인별 진행 현황이나 수정 사항, 문제 해결 방안에 대해 의견을 나누었고 GitHub Wiki를 활용하여 기록하였습니다.

- 📝[230817 회의록](https://github.com/inslog94/project/wiki/230817-%ED%9A%8C%EC%9D%98%EB%A1%9D)
- 📝[230818 회의록](https://github.com/inslog94/project/wiki/230818-%ED%9A%8C%EC%9D%98%EB%A1%9D)
- 📝[230822 회의록](https://github.com/inslog94/project/wiki/230822-%ED%9A%8C%EC%9D%98%EB%A1%9D)
- 📝[230823 회의록](https://github.com/inslog94/project/wiki/230823-%ED%9A%8C%EC%9D%98%EB%A1%9D)
- 📝[230824 회의록](https://github.com/inslog94/project/wiki/230824-%ED%9A%8C%EC%9D%98%EB%A1%9D)
- 📝[230825 회의록](https://github.com/inslog94/project/wiki/230825-%ED%9A%8C%EC%9D%98%EB%A1%9D)
- 📝[230828 회의록](https://github.com/inslog94/project/wiki/230828-%ED%9A%8C%EC%9D%98%EB%A1%9D)
- 📝[230829 회의록](https://github.com/inslog94/FavSpot/wiki/230829-%ED%9A%8C%EC%9D%98%EB%A1%9D)
- 📝[230830 회의록](https://github.com/inslog94/FavSpot/wiki/230830-%ED%9A%8C%EC%9D%98%EB%A1%9D)
- 📝[230831 회의록](https://github.com/inslog94/FavSpot/wiki/230831-%ED%9A%8C%EC%9D%98%EB%A1%9D)
<br><br>

## 5. 📁 BE 프로젝트 구조
```
📦 Backend
├─ .env
├─ manage.py
├─ poetry.lock
├─ pyproject.toml
│
├─ app
│  ├── asgi.py
│  ├── middleware.py
│  ├── settings.py
│  ├── urls.py
│  └── wsgi.py
│
├─ board
│  ├── admin.py
│  ├── apps.py
│  ├── models.py
│  ├── serializers.py
│  ├── tests.py
│  ├── urls.py
│  └── views.py
│
├─ pin
│  ├── admin.py
│  ├── apps.py
│  ├── models.py
│  ├── serializers.py
│  ├── tests.py
│  ├── urls.py
│  └── views.py
│
└─ user
    ├── admin.py
    ├── apps.py
    ├── models.py
    ├── serializers.py
    ├── tests.py
    ├── urls.py
    └── views.py
```
<br>

## 6. 🧠 프로젝트 기획(마인드맵)
<img width="900px" src="https://user-images.githubusercontent.com/43246395/264934537-2382af4b-0790-4ffc-8b84-b1c541e9231a.png">
<br><br>

## 7. 🗃️ 데이터베이스 설계
<img width="900px" src="https://user-images.githubusercontent.com/131739338/264935388-5d99ffdb-46a8-4151-87c3-57ce7115c08b.png">
<br><br>

## 8. 🔧 [BE] URL / Method 기능 설계
<img width="900px" src="https://user-images.githubusercontent.com/43246395/264934352-11e93308-0380-4a1d-852f-50715912e653.png">
<br><br>

## 9. 🔧 [FE] 페이지 구상 및 기능 설계
<img width="900px" src="https://user-images.githubusercontent.com/131739338/264934330-4aa211c4-d05f-4e1c-a2b9-393cc31614a4.png">
<br><br>

## 10. 🗺 샘플 이미지
| 보드 간편 생성 |
|:---:|
| <img width="900px" src="https://user-images.githubusercontent.com/131739338/264944130-d134a7b8-7dba-4389-b97a-2487e8b5da42.gif"> |

| 장소 검색 후 핀 저장 |
|:---:|
| <img width="900px" src="https://user-images.githubusercontent.com/131739338/264944163-a09da5ad-39a6-484c-840e-c680c0864f33.gif"> |