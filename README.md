# FavSpot

## 🌟 프로젝트 소개 🌟

```
💡 Favorite + Spot의 합성어로, 지도 API와 연동하여 자신이 좋아하는 장소를 보드에 담아
다른 사용자들과 공유하고 소통할 수 있는 웹/모바일 어플리케이션입니다.
```

* 🗺 지도에서 마음에 드는 장소를 골라 보드에 저장하고, 해당 장소에 대한 사진과 짧은 글을 남길 수 있습니다.
* 🔖 보드에 태그를 추가할 수 있고, 태그 기준으로 보드 검색이 가능합니다.
* 💛 보드를 구경하다가 마음에 드는 보드에 좋아요를 등록하거나, 댓글을 남길 수 있습니다.

<br>

## 기존 지도 앱과의 차별점
|기존 앱|FavSpot|
|:---:|:---:|
|단방향|양방향|
|장소들이 저장되어 있는 단순한 URL 링크로 공유되기 때문에 <br> 다른 사람이 저장한 장소 목록을 보기 위해선 링크가 필요|핀과 보드를 통해 장소와 의견을 공유하는 플랫폼 <br> 사이트 내에 존재하는 여러 보드를 통해 다른 사람이 저장한 장소 목록 확인|
|링크 공유로만 정보가 전달되는 구조|좋아요, 댓글, 팔로우, 관련 보드 검색 등 장소 공유에 최적화된 구조|
|  |  |
|실시간 알림 불가|실시간 알림 가능|
|새로고침을 통해 수동으로 업데이트 확인|실시간 알림 기능을 통해 업데이트 확인|

<br>

## 프로젝트 기간
### 정규 프로젝트 기간
<img width="900px" src="https://github.com/inslog94/FavSpot/assets/43246395/13cf8f98-f5de-47fa-b02b-0f2214139c95">

### 고도화 기간
#### 정규 프로젝트 기간 이후 미흡했던 부분을 개선하고 더욱 완성도 있는 프로젝트를 위해 추가적인 기능 구현, 리팩토링을 위한 시간을 가졌습니다.
<img width="900px" src="https://github.com/inslog94/FavSpot/assets/43246395/7ab36c2e-a484-4c7f-a69a-cdc83a51f6db">

<br>

### [목차]
1. [Collaborators](#1-collaborators)
2. [개발환경](#2-개발환경)
3. [협업 및 프로젝트 관리](#3-협업-및-프로젝트-관리)
4. [일일 회의](#4-일일-회의)
5. [BE 프로젝트 구조](#5-be-프로젝트-구조)
6. [프로젝트 기획(마인드맵)](#6-프로젝트-기획마인드맵)
7. [데이터베이스 설계](#7-데이터베이스-설계)
8. [[BE] URL / Method 기능 설계](#8-be-url--method-기능-설계)
9. [[FE] 페이지 구상 및 기능 설계](#9-fe-페이지-구상-및-기능-설계)
10. [샘플 이미지](#10-샘플-이미지)
<br><br>

## 1. Collaborators
| 전영인 [inslog94@gmail.com] | 이영 [2young020@gmail.com] | 이철우 [chwoo9528@gmail.com] | 신태우 [kwixs35@gmail.com] |
|:----------------------------:|:----------------------------:|:----------------------------:|:----------------------------:|
| 🙍‍♂️ User 관련 기능<br>🔗[GitHub](https://github.com/inslog94) | 🗂 Board CRUD 관련 기능<br>🔗[GitHub](https://github.com/2zero0) | 📍 Pin CRUD 관련 기능<br>🔗[GitHub](https://github.com/bloodsteelrain) | 🗺 Map 관련 기능<br>🔗[GitHub](https://github.com/hansanhha) |

<br>

## 2. 배포 URL
### URL
**http:// ~~~**

### Test Account
```
ID:
PW:
```
<br>

## 3. 개발환경
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

## 4. 협업 및 프로젝트 관리
### Commit Convention
🎉 프로젝트 시작 <br>
✨ 기능 추가 <br>
🩹 코드 수정 <br>
♻️ 코드 개선 <br>
🔥 코드 삭제 <br>
🐛 버그 수정 <br>
🗃️ DB 관련 추가/수정 <br>
🙈 gitignore 추가/수정 <br>
📝 문서 추가/수정 <br>
💄 UI 관련 추가/수정 <br>
🚚 파일/폴더 경로 수정 <br>
🔧 settings.py 관련 <br>
🚀 서비스 배포 <br>

### 협업 관리 도구
| Purpose | Tool |
| :------------: | :-------------: |
| 프로젝트 설계 | 🔗[Miro](https://miro.com/app/board/uXjVMtD8oGQ=/) |
| 프로젝트 관리 | 🔗[GitHub Project](https://github.com/users/inslog94/projects/3) |
| 이슈 관리 | 🔗[GitHub Issues](https://github.com/inslog94/FavSpot/issues) |
| 문서화 | 🔗[GitHub Wiki](https://github.com/inslog94/FavSpot/wiki) |
| 소통 | Discord |

<br>

## 5. 주요 기능
<img width="900px" alt="image" src="https://github.com/inslog94/FavSpot/assets/43246395/00714ba1-dde4-4f88-9464-a9dccdb3902a">

### 5-1. 메인페이지
<img width="900px" alt="image" src="https://github.com/inslog94/FavSpot/assets/43246395/c71e0cc1-fce0-4c2f-8618-8e041a116001">

-   지도 - 메인 페이지

    ```
    해당 기능은 메인페이지 지도 관련 기능입니다.

    메인 페이지의 지도는 kakao map API를 기반으로 제작되었으며 
    왼쪽 검색창을 통해 원하는 장소를 검색하면 지도상에 그 장소의 마커가 표시됩니다.
    마커를 클릭하면 그 장소에 대한 간략한 정보와 함께 
    상세보기, 간편 생성(보드, 핀)을 할 수 있는 버튼이 있는 작은 창이 생깁니다.
    오른쪽 보드 목록에는 처음에는 랜덤한 공개 보드가 나타나며 지도 검색창 사용 시 키워드에 맞는 보드 목록이 나타납니다.
    ```

### 5-2. Pin
<img width="900px" alt="image" src="https://github.com/inslog94/FavSpot/assets/43246395/e5b85ea5-08ae-48ed-9457-92afc02b9c9a">


-   핀 생성 | 조회
    ```
    지도의 핀 간편 저장이나 핀 상세보기 모달의 저장 버튼을 통해 자신의 보드에 원하는 장소를 핀의 형태로 저장할 수 있습니다.
    핀에는 카카오 API에서 제공하는 정보들과 크롤링을 통한 대표 이미지가 포함됩니다.

    핀 상세보기 모달은 메인페이지의 지도 위, 보드 상세보기 페이지, 
    그리고 핀 코멘트 목록 페이지에서 열 수 있습니다.
    핀 상세보기 모달에서는 그 장소에 대한 정보와 코멘트들을 확인할 수 있습니다. 
    코멘트는 1페이지당 3개씩 볼 수 있는 페이지네이션이 적용되어 있습니다.
    해당 장소에 대한 정적 지도가 포함되어 있습니다.

    ```

-   핀 코멘트 생성 | 조회 | 수정 | 삭제
    ```
    핀을 저장할 때 그 장소에 대한 사진과 짧은 글이 포함된 코멘트를 작성할 수 있습니다. 
    이 때 코멘트를 작성하지 않는다면(사진, 글 둘 다 작성하지 않을 시) is_deleted=True의 속성을 가진 코멘트가 생성됩니다.
    코멘트는 자신의 유저 정보 페이지의 핀 코멘트 목록에서 수정, 삭제할 수 있습니다. 
    내용이 없거나 이미 삭제한 is_deleted=True인 코멘트도 수정하여 살릴 수 있습니다.
    핀 상세보기 모달에서도 본인의 코멘트를 삭제할 수 있습니다.
    ```

### 5-3. Board
<img width="900px" alt="image" src="https://github.com/inslog94/FavSpot/assets/43246395/8194c0aa-c0b2-4c31-9ced-0b5a559063db">

-   보드 생성 | 조회 | 수정 | 삭제
    ```
    보드의 제목과 태그를 입력, 공개 여부를 설정하여 본인의 유저 정보 페이지에서 새로운 보드를 생성하거나,
    메인페이지에서 장소 검색을 통해 보드에 저장하고 싶은 곳을 찾고 즉석으로 보드를 간편하게 생성할 수 있습니다.

    공개된 보드는 메인페이지에서 조회되는데, 검색 시 검색어가 제목 또는 태그에 포함된 보드라면 검색 결과 목록에 조회됩니다.
    자신의 보드 목록은 유저 정보 페이지에서 확인할 수 있습니다.

    보드 상세보기 페이지에서는 보드 정보로 보드의 이름, 작성자, 작성 시간, 좋아요 개수, 태그가 표기됩니다.
    또한 해당 보드에 담긴 핀들이 표시된 지도 그리고 핀 목록, 댓글 목록이 표기됩니다.

    보드 생성자인 경우 보드 수정 버튼이 보여지고 
    이 버튼을 클릭 시 띄워지는 보드 수정 모달에서 해당 보드를 수정할 수 있습니다. 
    이 때 보드의 제목, 태그, 공개/비공개 설정을 수정할 수 있으며 보드에 담긴 핀을 삭제할 수 있습니다.

    보드 삭제 버튼을 누르면 보드를 삭제할 수 있습니다.
    이 때 본인이 생성한 보드만 삭제가 가능합니다.
    ```

-   좋아요 기능
    ```
    좋아요 버튼을 눌러 특정 보드에 대한 좋아요를 등록하고 다시 한번 누르면 해제할 수 있습니다.

    유저 정보 페이지에서 좋아요한 보드 목록 버튼을 눌러 본인이 좋아요를 등록한 보드 목록을 조회할 수 있습니다.
    다른 유저의 정보 페이지에서도 다른 유저가 좋아요를 등록한 보드 목록을 조회할 수 있습니다.
    ```

-   태그 기능
    ```
    보드 상세보기 페이지에서 특정 태그를 클릭하면 그 태그가 포함된 전체 보드 목록을 조회할 수 있습니다. 

    유저 정보 페이지에서 태그 목록 중 특정 태그를 클릭하면 그 태그가 포함된 자신의 보드 목록을 조회할 수 있습니다. 
    다른 유저의 정보 페이지에서도 태그 목록 중 특정 태그를 클릭하면
     그 태그가 포함된 해당 유저의 보드 목록을 조회할 수 있습니다.
    ```

-   보드 댓글 생성 | 조회 | 삭제
    ```
    보드 상세보기 페이지에서 특정 보드에 대한 댓글을 조회할 수 있습니다.

    보드 상세보기 페이지에서 특정 보드에 대한 댓글을 생성할 수 있습니다.

    보드 상세보기 페이지에서 특정 보드에 대한 댓글을 삭제할 수 있습니다.
    이 때 본인이 작성한 댓글만 삭제가 가능합니다.
    ```

### 5-4. User
<img width="900px" alt="image" src="https://github.com/inslog94/FavSpot/assets/43246395/82a620c4-19c6-4277-addf-5748ed3f8f0b">

- 회원가입 및 로그인, 소셜 로그인 (Kakao, Google)

  ```
  이메일을 통한 회원가입 뿐만 아니라 카카오와 구글을 이용한 소셜 회원가입/로그인 기능을 제공하고 있습니다.
  회원가입 시 중복 계정을 체크하는 과정에서 소셜 로그인으로 가입된 계정인 경우
  가입했던 플랫폼에 대한 알림 문구를 받을 수 있습니다. (ex. Google로 가입된 계정입니다.)
  ```

- JSON Web Token 인증 방식

  ```
  회원가입과 로그인 시 발급된 Refresh Token과 Access Token을 HTTP Only 속성으로 쿠키에 저장하여 응답합니다.
  JavaScript를 통해 발급된 토큰값에 직접 접근할 수 없기 때문에 요청 시 "credentials - include"를 통해 
  백엔드 서버로 전달하여 미들웨어를 통해 토큰을 검증하는 과정을 거칩니다.
  
  로그아웃 시에는 Refresh Token과 Access Token을 쿠키에서 제거한 뒤 응답하는 방식으로 처리합니다.
  ```

- 유저 정보 수정

  ```
  공통적으로 회원가입 후 자신을 표현하는 프로필 이미지와 닉네임을 수정할 수 있는 기능을 제공하고 있습니다.
  처음 수정 페이지에 접근하면 데이터베이스를 통해 현재 본인이 설정해둔 닉네임과 썸네일 이미지를 확인할 수 있으며,
  새로 프로필 이미지를 업로드하면서 미리보기로 현재 본인이 선택한 이미지를 확인할 수 있습니다.

  일반 회원가입 유저의 경우 추가로 비밀번호 수정이 가능하며,
  이 때는 비밀번호 재확인 과정이 필요하고 비밀번호가 잘못된 경우 프로필 이미지, 닉네임 변경이 적용되지 않습니다.
  ```

- Follow / Unfollow 기능
  ```
  관심있는 활동을 하는 유저와 팔로워를 맺을 수 있습니다.
  자신의 팔로워/팔로잉 목록을 통해 관리가 가능하며, 해당 페이지에서 다른 유저의 정보 페이지로 이동이 가능합니다.
  ```

### 5-5. Notification
<img width="900px" alt="image" src="https://github.com/inslog94/FavSpot/assets/43246395/0d7b2b27-8c5f-44d9-af65-63e50b30ccc0">

-   실시간 알림 기능
    ```
    누군가 나를 팔로우 했을 때, 내 보드에 댓글 또는 좋아요를 남겼을 때, 내가 좋아요한 보드에 새로운 핀이 추가되었을 때 
    Django-signal을 통한 알림이 생성됩니다.
    이 때 Channels를 활용하여 WebSocket을 통해 실시간 통신을 지원하고, 
    알림 메시지를 클라이언트에게 실시간으로 전달하게 됩니다.
    그와 동시에 알림 객체가 저장되어 본인이 수신한 알림들에 대한 여러 작업이 가능해집니다.
    ```

-   알림 목록 조회 | 삭제 | 읽음 처리
    ```
    본인이 수신한 알림 목록을 조회할 수 있습니다. 
    이 때 알림 내용을 클릭해 관련 보드나 유저 정보 페이지로 이동할 수 있습니다. 이렇게 클릭한 알림은 '읽음'처리가 됩니다.
    각 알림의 오른쪽에 있는 체크박스를 체크해서 몇 개의 알림을 선택했는지 확인하고 다중 삭제 및 읽음 처리를 할 수 있습니다.
    ```

    <br>

## 6. 일일 회의
🙋‍♂️ 매일 아침, 저녁으로 회의를 진행하여 개인별 진행 현황이나 수정 사항, 문제 해결 방안에 대해 의견을 나누었고 GitHub Wiki를 활용하여 기록하였습니다.

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


## 7. 고도화 기록
#### 정규 프로젝트 기간 이후 추가할 기능과 수정 사항을 종합하여 고도화 계획을 세웠습니다. 기존과 동일하게 하루 3번 회의를 진행하였고 피드백 사항을 반영하여 GitHub Wiki를 더욱 체계적으로 활용하여 기록하였습니다.

### 7-1. 진행사항 및 일일 개발일지
<img width="900px" src="https://github.com/inslog94/FavSpot/assets/43246395/a4317907-b4ba-4357-9185-4cabeff0998a"> <br>

* 📖 [230908 개발일지](https://github.com/inslog94/FavSpot/wiki/230908-%EA%B0%9C%EB%B0%9C%EC%9D%BC%EC%A7%80)
* 📖 [230911 개발일지](https://github.com/inslog94/FavSpot/wiki/230911-%EA%B0%9C%EB%B0%9C%EC%9D%BC%EC%A7%80)
* 📖 [230912 개발일지](https://github.com/inslog94/FavSpot/wiki/230912-%EA%B0%9C%EB%B0%9C%EC%9D%BC%EC%A7%80)
* 📖 [230913 개발일지](https://github.com/inslog94/FavSpot/wiki/230913-%EA%B0%9C%EB%B0%9C%EC%9D%BC%EC%A7%80)
* 📖 [230914 개발일지](https://github.com/inslog94/FavSpot/wiki/230914-%EA%B0%9C%EB%B0%9C%EC%9D%BC%EC%A7%80)
* 📖 [230915 개발일지](https://github.com/inslog94/FavSpot/wiki/230915-%EA%B0%9C%EB%B0%9C%EC%9D%BC%EC%A7%80)
* 📖 [230918 개발일지](https://github.com/inslog94/FavSpot/wiki/230918-%EA%B0%9C%EB%B0%9C%EC%9D%BC%EC%A7%80)
* 📖 [230921 개발일지](https://github.com/inslog94/FavSpot/wiki/230921-%EA%B0%9C%EB%B0%9C%EC%9D%BC%EC%A7%80)
* 📖 [230922 개발일지](https://github.com/inslog94/FavSpot/wiki/230922-%EA%B0%9C%EB%B0%9C%EC%9D%BC%EC%A7%80)
* 📖 [230925 개발일지](https://github.com/inslog94/FavSpot/wiki/230925-%EA%B0%9C%EB%B0%9C%EC%9D%BC%EC%A7%80)
* 📖 [230926 개발일지](https://github.com/inslog94/FavSpot/wiki/230926-%EA%B0%9C%EB%B0%9C%EC%9D%BC%EC%A7%80)
* 📖 [230927 개발일지](https://github.com/inslog94/FavSpot/wiki/230927-%EA%B0%9C%EB%B0%9C%EC%9D%BC%EC%A7%80)
* 📖 [231004 개발일지](https://github.com/inslog94/FavSpot/wiki/231004-%EA%B0%9C%EB%B0%9C%EC%9D%BC%EC%A7%80)
* 📖 [231005 개발일지](https://github.com/inslog94/FavSpot/wiki/231005-%EA%B0%9C%EB%B0%9C%EC%9D%BC%EC%A7%80)
* 📖 [231006 개발일지](https://github.com/inslog94/FavSpot/wiki/231006-%EA%B0%9C%EB%B0%9C%EC%9D%BC%EC%A7%80)
* 📖 [231009 개발일지](https://github.com/inslog94/FavSpot/wiki/231009-%EA%B0%9C%EB%B0%9C%EC%9D%BC%EC%A7%80)
* 📖 [231010 개발일지](https://github.com/inslog94/FavSpot/wiki/231010-%EA%B0%9C%EB%B0%9C%EC%9D%BC%EC%A7%80)
* 📖 [231011 개발일지](https://github.com/inslog94/FavSpot/wiki/231011-%EA%B0%9C%EB%B0%9C%EC%9D%BC%EC%A7%80)
* 📖 [231012 개발일지](https://github.com/inslog94/FavSpot/wiki/231012-%EA%B0%9C%EB%B0%9C%EC%9D%BC%EC%A7%80)
* 📖 [231013 개발일지](https://github.com/inslog94/FavSpot/wiki/231013-%EA%B0%9C%EB%B0%9C%EC%9D%BC%EC%A7%80)

<br>

### 7-2. TIL (Today I Learn)
<details>
<summary>예시 이미지 첨부</summary>

![image](https://github.com/inslog94/FavSpot/assets/43246395/478773c1-3d32-4b67-beaf-dae3d577f622)

</details>


* 🔧 [230908 TIL](https://github.com/inslog94/FavSpot/wiki/230908-TIL)
* 🔧 [230911 TIL](https://github.com/inslog94/FavSpot/wiki/230911-TIL)
* 🔧 [230912 TIL](https://github.com/inslog94/FavSpot/wiki/230912-TIL)
* 🔧 [230913 TIL](https://github.com/inslog94/FavSpot/wiki/230913-TIL)
* 🔧 [230914 TIL](https://github.com/inslog94/FavSpot/wiki/230914-TIL)
* 🔧 [230915 TIL](https://github.com/inslog94/FavSpot/wiki/230915-TIL)
* 🔧 [230921 TIL](https://github.com/inslog94/FavSpot/wiki/230921-TIL)
* 🔧 [230922 TIL](https://github.com/inslog94/FavSpot/wiki/230922-TIL)
* 🔧 [230925 TIL](https://github.com/inslog94/FavSpot/wiki/230925-TIL)
* 🔧 [230926 TIL](https://github.com/inslog94/FavSpot/wiki/230926-TIL)
* 🔧 [230927 TIL](https://github.com/inslog94/FavSpot/wiki/230927-TIL)
* 🔧 [231004 TIL](https://github.com/inslog94/FavSpot/wiki/231004-TIL)
* 🔧 [231005 TIL](https://github.com/inslog94/FavSpot/wiki/231005-TIL)
* 🔧 [231006 TIL](https://github.com/inslog94/FavSpot/wiki/231006-TIL)
* 🔧 [231009 TIL](https://github.com/inslog94/FavSpot/wiki/231009-TIL)
* 🔧 [231010 TIL](https://github.com/inslog94/FavSpot/wiki/231010-TIL)
* 🔧 [231011 TIL](https://github.com/inslog94/FavSpot/wiki/231011-TIL)
* 🔧 [231012 TIL](https://github.com/inslog94/FavSpot/wiki/231012-TIL)
* 🔧 [231013 TIL](https://github.com/inslog94/FavSpot/wiki/231013-TIL)

<br>

## 8. 협업 방식
```
💡 앱 단위로 역할을 나누어 각자 맡은 앱에 대한 브랜치를 생성하여 기능 구현을 하였습니다.
이 결과 코드를 병합하는 과정에서 충돌을 최소화할 수 있었습니다.
```
<br>

### GitHub 프로젝트(Projects) 활용한 작업 관리 & Pull Request - Merge

**1. 각 아이템을 진행 상황에 따라 배치** <br>
<img width="900px" src="https://github.com/inslog94/FavSpot/assets/43246395/1a88f148-f6ad-4c42-adee-b9ee936b72c1"> 

    Todo - 개발 예정인 작업
    협의한 내용을 토대로 각자 개발할 기능뿐만 아니라 추가적으로 발견한 문제 사항에 대해서도 아이템 생성

    In Progress - 현재 진행중인 작업
    Todo 목록 중 우선순위가 높은 아이템 순서로 하나씩 옮겨가며 작업을 진행 (아이템을 issue로 변환)

    Done - 완료된 작업
    완료된 작업은 PR-merge 작업을 통해 자동으로 Done 목록으로 이동

<br>


**2. 작업 진행 시 아이템을 issue로 변환하고 기능 구현 시작** <br>
<img width="900px" src="https://github.com/inslog94/FavSpot/assets/43246395/ae79b7fb-6689-4f09-b85a-2b039583adf7">


**3. 기능을 완성하면 Pull Request 생성** <br>
<img width="900px" src="https://github.com/inslog94/FavSpot/assets/43246395/67ba6fb5-c8aa-42b3-ab1d-3d2e1b3ef013">

**4. 해당 Pull Request 내용을 토대로 팀원들과의 코드리뷰** <br>
<img width="900px" src="https://github.com/inslog94/FavSpot/assets/43246395/ea967def-2752-4c98-9b06-be7e09f624c5">

**5. 코드 리뷰를 마치면 develop브랜치에 merge** <br>
<img width="900px" src="https://github.com/inslog94/FavSpot/assets/43246395/fbffc61a-dbe5-4928-91e2-9557c4624f64">


<br>

## 9. 프로젝트 구조
### 9-1. BE 프로젝트 구조
```
🗃️ Backend
 ┣ 📂app
 ┃ ┣ 📜middleware.py
 ┃ ┣ 📜settings.py
 ┃ ┣ 📜urls.py
 ┃ ┗ 📜wsgi.py
 ┣ 📂board
 ┃ ┣ 📜admin.py
 ┃ ┣ 📜apps.py
 ┃ ┣ 📜excluded_path.py
 ┃ ┣ 📜models.py
 ┃ ┣ 📜serializers.py
 ┃ ┣ 📜tests.py
 ┃ ┣ 📜urls.py
 ┃ ┗ 📜views.py
 ┣ 📂notification
 ┃ ┣ 📜admin.py
 ┃ ┣ 📜apps.py
 ┃ ┣ 📜consumers.py
 ┃ ┣ 📜models.py
 ┃ ┣ 📜routing.py
 ┃ ┣ 📜serializers.py
 ┃ ┣ 📜tests.py
 ┃ ┣ 📜urls.py
 ┃ ┗ 📜views.py
 ┣ 📂pin
 ┃ ┣ 📜admin.py
 ┃ ┣ 📜apps.py
 ┃ ┣ 📜models.py
 ┃ ┣ 📜paginations.py
 ┃ ┣ 📜serializers.py
 ┃ ┣ 📜tests.py
 ┃ ┣ 📜urls.py
 ┃ ┗ 📜views.py
 ┣ 📂user
 ┃ ┣ 📜admin.py
 ┃ ┣ 📜apps.py
 ┃ ┣ 📜models.py
 ┃ ┣ 📜serializers.py
 ┃ ┣ 📜tests.py
 ┃ ┣ 📜urls.py
 ┃ ┗ 📜views.py
 ┣ 📜.env
 ┣ 📜manage.py
 ┣ 📜poetry.lock
 ┗ 📜pyproject.toml
```

### 9-2. FE 프로젝트 구조
```
🎨 Frontend
 ┣ 📂assets
 ┃ ┣ 📂css
 ┃ ┃ ┣ 📂template
 ┃ ┃ ┣ 📜board-detail.css
 ┃ ┃ ┣ 📜board-list.css
 ┃ ┃ ┣ 📜index.css
 ┃ ┃ ┣ 📜map.css
 ┃ ┃ ┣ 📜modal.css
 ┃ ┃ ┗ 📜pin-list.css
 ┃ ┣ 📂fonts
 ┃ ┣ 📂html
 ┃ ┃ ┣ 📜404.html
 ┃ ┃ ┣ 📜board_detail.html
 ┃ ┃ ┣ 📜follower.html
 ┃ ┃ ┣ 📜following.html
 ┃ ┃ ┣ 📜login.html
 ┃ ┃ ┣ 📜notification.html
 ┃ ┃ ┣ 📜pin_list.html
 ┃ ┃ ┣ 📜profile_edit.html
 ┃ ┃ ┣ 📜signup.html
 ┃ ┃ ┣ 📜tagged_board_list.html
 ┃ ┃ ┣ 📜user_info.html
 ┃ ┃ ┣ 📜user_liked_board.html
 ┃ ┃ ┗ 📜user_tagged_board.html
 ┃ ┣ 📂img
 ┃ ┃ ┣ 📂pre-loader
 ┃ ┃ ┃ ┗ 📜loader-03.svg
 ┃ ┃ ┣ 📜404.png
 ┃ ┃ ┣ 📜fav.png
 ┃ ┃ ┣ 📜favspot.png
 ┃ ┃ ┗ 📜user.png
 ┃ ┗ 📂js
 ┃ ┃ ┣ 📂template
 ┃ ┃ ┣ 📂util
 ┃ ┃ ┃ ┣ 📜boardCreateModal.js
 ┃ ┃ ┃ ┣ 📜boardSlide.js
 ┃ ┃ ┃ ┣ 📜customFetch.js
 ┃ ┃ ┃ ┣ 📜footer.js
 ┃ ┃ ┃ ┣ 📜getPlaceInfo.js
 ┃ ┃ ┃ ┣ 📜header.js
 ┃ ┃ ┃ ┣ 📜pinDetailModal.js
 ┃ ┃ ┃ ┣ 📜preloader.js
 ┃ ┃ ┃ ┣ 📜responsive.js
 ┃ ┃ ┃ ┣ 📜script.js
 ┃ ┃ ┃ ┣ 📜setPlaceInfo.js
 ┃ ┃ ┃ ┗ 📜staticMap.js
 ┃ ┃ ┣ 📜board.js
 ┃ ┃ ┣ 📜boardDetail.js
 ┃ ┃ ┣ 📜content.js
 ┃ ┃ ┣ 📜data.js
 ┃ ┃ ┣ 📜event.js
 ┃ ┃ ┣ 📜follower.js
 ┃ ┃ ┣ 📜following.js
 ┃ ┃ ┣ 📜index.js
 ┃ ┃ ┣ 📜login.js
 ┃ ┃ ┣ 📜map.js
 ┃ ┃ ┣ 📜notifications.js
 ┃ ┃ ┣ 📜pin.js
 ┃ ┃ ┣ 📜pinDetail.js
 ┃ ┃ ┣ 📜pinList.js
 ┃ ┃ ┣ 📜profileEdit.js
 ┃ ┃ ┣ 📜search.js
 ┃ ┃ ┣ 📜signup.js
 ┃ ┃ ┣ 📜taggedBoard.js
 ┃ ┃ ┣ 📜userInfo.js
 ┃ ┃ ┣ 📜userLikedBoard.js
 ┃ ┃ ┣ 📜userTaggedBoard.js
 ┃ ┃ ┗ 📜websocket.js
 ┗ 📜index.html
```
<br>

## 10. 프로젝트 기획(마인드맵)
<img width="900px" src="https://user-images.githubusercontent.com/43246395/264934537-2382af4b-0790-4ffc-8b84-b1c541e9231a.png">
<br><br>

## 11. 데이터베이스 설계
<img width="900px" src="https://github.com/inslog94/FavSpot/assets/43246395/9a63d056-89bc-4035-b701-d40c4ebd5314">
<br><br>

## 12. 기능 설계
### 12-1. [BE] URL / Method 기능 설계
|Function|Method|URL|
|------|---|---|
|**User**|||
|소셜 로그인|POST|user/auth/|
|로그인|POST|user/login/|
|회원가입|POST|user/signup/|
|유저정보 조회|GET|user/\<int:pk>/|
|내 정보 조회|GET|user/me/|
|프로필 수정|PATCH|user/me/|
|팔로우|POST|user/follows/|
|팔로우 삭제|DELETE|user/follows/\<int:pk>/|
|팔로우 리스트 조회|GET|user/\<int:pk>/following/|
|팔로잉 리스트 조회|GET|user/\<int:pk>/follower/|
|**Pin**|||
|핀 상세정보 조회|GET|pin/\<str:place_id>/|
|핀 생성|POST|pin/|
|핀 수정|PUT|pin/content/\<int:pk>/|
|핀 삭제|DELETE|pin/content/\<int:pk>/|
|**Board**|||
|보드 전체 목록 조회|GET|board/|
|보드 상세정보 조회|GET|board/\<int:pk>/|
|보드 생성|POST|board/|
|보드 수정|PUT|board/\<int:pk>/|
|보드 삭제|DELETE|board/\<int:pk>/|
|보드 댓글 작성|POST|board/\<int:pk>/comment/|
|보드 댓글 삭제|DELETE|board/comment/\<int:pk>/|
|보드 좋아요 등록|POST|board/\<int:pk>/like/|
|보드 좋아요 해제|DELETE|board/like/\<int:pk>/|
|좋아요 등록한 보드 목록 조회|GET|board/like/|
|보드 검색|GET|board/search/|
|특정 태그가 등록된 보드 목록 조회|GET|board/\<int:pk>\/tag/|
|**Notification**|||
|알림 목록 조회|GET|notification/|
|알림 삭제|DELETE|notification/\<int:pk>/|
|알림 읽음 처리|POST|notification/\<int:pk>/read/|

### 12-2. [FE] 페이지 구상 및 기능 설계
|페이지|위치|기능|
|---|---|---|
|**Main**|||
|메인 페이지|/|[지도에서 키워드 검색 후 마커 / 결과 목록에서 특정 장소 클릭] <br> - 상세보기 버튼 <br> - 핀 생성 버튼 <br> - 보드 간편생성 버튼 <br> [보드 목록] <br> - 검색 키워드가 보드의 이름 또는 태그에 포함되는 보드 목록 조회 <br> - 정렬 드롭다운 클릭 시 최신순 / 좋아요순 / 핀개수 순으로 정렬|
|**User**|||
|로그인|header|소셜 로그인(카카오, 구글) 가능|
|회원가입|header|중복 이메일, 비밀번호 규칙 등 여러 가지 예외 처리 기능|
|유저 정보|header| 내 보드 목록 조회 및 보드 생성 버튼 <br> [프로필 사이드바] <br> - 프로필 보기 <br> - 프로필 수정 버튼(타인-팔로우 버튼) <br> - 팔로우/팔로워 리스트 버튼(개수) <br> - 핀 콘텐츠 리스트 버튼 <br> - 좋아요한 보드 리스트 버튼|
|프로필 수정|header, 프로필 사이드바|닉네임, 사진 등은 자유롭게 변경, 비밀번호 변경시 기존 비밀번호 입력 필요|
|팔로우/팔로워 리스트|프로필 사이드바|제공되는 데이터에 따라 팔로우/팔로워 목록 보여줌, 팔로우/언팔로우 가능|
|**Pin**|||
|핀 상세정보 조회 모달|메인페이지, 보드 상세정보 페이지, 핀 코멘트 목록 페이지|- 핀 상세정보 표기 <br> - 그 장소의 정적 지도 <br> - 핀 생성(저장)버튼 <br> - 본인 핀 콘텐츠 삭제 버튼 <br> - 핀 생성시 핀 콘텐츠(사진/짧은 글) 작성 기능|
|핀 콘텐츠 리스트|프로필 사이드바|- 자신이 작성한 핀 콘텐츠 목록 보기 <br> - 핀 이름 클릭시 상세정보 조회 모달 <br> - 수정/삭제 버튼|
|**Board**|||
|보드 생성 모달|유저 정보 페이지|- 보드 이름 설정 <br> - 보드 태그 추가|
|보드 상세정보|메인페이지, 유저 정보 페이지|- 보드 정보 (보드 이름, 작성자, 작성 시간, 좋아요 개수, 태그, 공개 여부) <br> - 보드에 포함된 핀들이 찍혀있는 지도 <br> - 좋아요 적용/해제 버튼 및 로그인된 유저의 좋아요 등록 여부 <br> - 보드 수정/삭제 버튼 <br> - 핀 목록 <br> - 댓글 목록 및 본인 댓글 삭제 버튼 <br> - 댓글 작성란|
|보드 수정 모달|보드 상세정보 페이지|- 보드 이름 수정 <br> - 보드 태그 추가/삭제 <br> - 공개 여부 수정 <br> - 해당 보드에 등록된 핀 삭제|
|좋아요한 보드 리스트|프로필 사이드바|본인 또는 다른 유저가 좋아요를 등록한 보드 목록 조회|
|특정 태그 포함하는 보드 목록|보드 상세정보 페이지|특정 태그를 포함하는 모든 보드 목록 조회|
|특정 태그 포함하는 본인/다른 유저 보드 목록|유저 정보 페이지|특정 태그를 포함하는 본인/다른 유저의 보드 목록 조회|
|**Notification**|||
|알림 리스트|header|- 본인이 받은 알림 목록 표기 <br> - 클릭으로 관련 페이지 이동 및 읽음 처리 <br> - 체크박스를 통한 다중 삭제 및 읽음 버튼|

<br><br>


## 13. API 명세서
### URL
**http://.../schema/swagger-ui/**

### DRF-Spectacular를 활용한 Swagger UI
<img width="900px" src="https://github.com/inslog94/FavSpot/assets/43246395/30a5c809-d84a-45e8-8524-d828e6605d80">

### 1. (예시1) Board 생성 API
- URL: `http://127.0.0.1:8000/schema/swagger-ui/#/board/board_create/`
- Method: POST
- Description: 새로운 보드를 생성합니다. <br>
요청 본문에는 'title' 필드 값이 반드시 포함되어야 합니다. <br>
선택적 필드로 'is_pubic'은 보드의 공개/비공개 설정이고 'is_deleted'는 삭제 여부입니다. <br>
이 때 'is_public'은 True, 'is_deleted'는 false가 기본값입니다. <br>
또한 'tags' 필드를 포함시킬 수 있으며, 이는 태그의 배열입니다. <br> 성공적으로 보드가 생성되면 생성된 Board 객체를 반환하고, 그렇지 않으면 오류 메시지를 반환합니다.

**요청 예시**:
```json
{
  "title": "새로운 보드 이름",
  "is_public": true,
  "tags": [
    "태그1",
    "태그2"
  ]
}
```
**응답 예시**:
```
{
  "id": 11,
  "user_id": 유저의 PK,
  "user": "유저의 이메일",
  "tags": [
    "태그1",
    "태그2"
  ],
  "title": "새로운 보드 이름",
  "created_at": "2023-09-27T11:24:19.485913+09:00",
  "updated_at": "2023-09-27T11:24:19.485913+09:00",
  "is_deleted": false,
  "is_public": true
}
```

### 2. (예시2) Pin 생성 API
- URL: `http://127.0.0.1:8000/schema/swagger-ui/#/pin/pin_create/`
- Method: POST
- Description: 새로운 핀을 생성하거나, 이미 그 장소에 대한 핀이 생성되어 있는 경우 지정해준 보드에 핀을 저장합니다. 이 때 핀 코멘트를 함께 생성합니다. <br>
요청 본문에는 'board_id', 'category', 'place_id', 'title', 'new_address', 'old_address', 'lat_lng' 필드가 반드시 포함되어야 합니다. <br>
또한 동시에 생성되는 핀 코멘트 내용인 'text'와 첨부 사진인 'photo' 필드는 각각 포함시키거나 포함시키지 않을 수 있습니다. 핀 코멘트에 'text'와 'photo' 필드가 둘 다 비어 있다면 is_deleted=True 속성으로 생성됩니다. photo 필드에 이미지 파일 데이터를 제공하려면 multipart/form-data 형식으로 전송해야 합니다. <br><br>
요청이 들어오면 요청 본문의 'place_id' 값과 같은 값을 지닌 핀이 이미 존재하는지 확인한 후, 존재한다면 그 핀에 'board_id'의 보드를 추가하고 핀 콘텐츠를 생성하고 기존의 핀과 생성된 핀 콘텐츠 객체를 반환합니다. <br>
존재하지 않는다면 요청 본문의 값을 토대로 핀과 핀 콘텐츠를 새롭게 생성하고 생성된 핀과 핀 콘텐츠 객체를 반환합니다. <br>
새로운 핀을 생성 시 place_id에 대응하는 장소의 카카오맵 상세 페이지에 대표 이미지가 존재한다면 크롤링을 통해 가져와 'thumbnail_img'필드에 저장합니다. <br> 생성 과정에서 문제가 생겼다면 오류 메시지를 반환합니다.

**요청 예시**:
```json
{
  "board_id": 12,
  "category": "카페",
  "place_id": "123123",
  "title": "카페 이름",
  "new_address": "서울 마포구 도로명로 123-4",
  "old_address": "서울 마포구 지번동 123-45",
  "lat_lng": "37.123123,127.456456",
  "text": "그 장소에 대한 감상평 또는 메모",
  "photo": "실제 요청에서는 이곳에 이미지 파일 데이터를 첨부합니다"
}
```
**응답 예시**:
```json
{
  "pin": {
    "id": 21,
    "category": "카페",
    "board_id": [
      8,
      12,
    ],
    "place_id": "123123",
    "title": "카페 이름",
    "thumbnail_img": "카카오맵 사이트에서 크롤링한 대표 이미지 주소",
    "new_address": "서울 마포구 도로명로 123-4",
    "old_address": "서울 마포구 지번동 123-45",
    "lat_lng": "37.123123,127.456456",
    "updated_at": "2023-10-16T02:03:54.433Z"
  },
  "pin_content": {
    "id": 25,
    "email": "myaccount@email.com",
    "user_id": 3,
    "text": "그 장소에 대한 감상평 또는 메모",
    "photo": "그 장소에 대해 업로드한 사진의 경로",
    "pin_title": "카페 이름",
    "place_id": "123123",
    "is_deleted": false
  }
}
```

### 3. (예시3) Notification 목록 조회 API
- URL: `http://127.0.0.1:8000/schema/swagger-ui/#/notification/notification_retrieve/`
- Method: GET
- Description: 본인이 수신한 알림 목록을 조회합니다. <br>
알림은 본인을 누군가가 팔로우했을 때, 본인의 보드에 누군가가 댓글을 남기거나 좋아요를 했을 때, 본인이 좋아요한 다른 유저의 보드에 새롭게 핀이 추가되었을 때 django-signal을 통해 생성되고 수신됩니다. <br>
인증된 사용자만이 본인에게 수신된 알림(reciever가 본인의 id)들만 볼 수 있습니다. <br>
이때 응답에는 알림 메세지 내용, 읽음 여부, 수신자, 발신자, 발신 시간 등이 포함됩니다. <br>
또한 알림과 연관된 페이지로 연결하는 기능을 사용할 수 있도록 알림 종류와 연관 보드/유저의 pk값이 포함되어 있습니다.

**응답 예시**:
```json
[
  {
    "id": 7,
    "message": "알림 내용",
    "sender": 2,
    "receiver": 3,
    "is_read": false,
    "created_at": "2023-10-16T02:18:22.461Z",
    "sender_profile_img": "발신자의 프로필 이미지 경로",
    "related_url": "update(알림 종류), 9(연관 보드나 유저 pk값)"
  }
]
```

<br>

## 14. 샘플 이미지
| 보드 간편 생성 |
|:---:|
| |

| 장소 검색 후 핀 저장 |
|:---:|
| |


<br>

## 15. 느낀점
- 공통 <br>
에러 메시지, 예외처리

**이 영**

ㅇㅇㅇ

<br>

**이철우**

ㅇㅇㅇ

<br>

**전영인**

ㅇㅇㅇ
