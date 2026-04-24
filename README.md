<img width="7680" height="4320" alt="1" src="https://github.com/user-attachments/assets/a314bdc0-6d29-4a48-89c6-df2640baea67" />
<img width="7680" height="4320" alt="2" src="https://github.com/user-attachments/assets/eb093c0b-ab7f-4323-9472-8d349b4f0b10" />
<img width="7680" height="4320" alt="3" src="https://github.com/user-attachments/assets/b51ad6d2-a89e-489a-8bba-f2d4a2f38baa" />
<img width="7680" height="4320" alt="4" src="https://github.com/user-attachments/assets/eb0d82fc-048c-46de-9ff9-ee9e24bf0d80" />
<img width="7680" height="4320" alt="5" src="https://github.com/user-attachments/assets/4fc3bf4c-4ea4-4c39-938f-ba915f2bbf02" />
<img width="7680" height="4320" alt="6" src="https://github.com/user-attachments/assets/d4c3da9b-bb71-458c-abe2-18b651789e55" />
<img width="7680" height="4320" alt="7" src="https://github.com/user-attachments/assets/11651854-53c8-4147-bae3-c98e49ea95e9" />
<img width="7680" height="4320" alt="8" src="https://github.com/user-attachments/assets/323643dc-2d8c-4dde-b861-4bdb357bdd50" />
<img width="7680" height="4320" alt="9" src="https://github.com/user-attachments/assets/4d5d1d97-9050-4f37-9bbe-c17151935766" />
<img width="7680" height="4320" alt="10" src="https://github.com/user-attachments/assets/5cbda377-0aba-443a-900a-a1e5a9ecb74f" />
<img width="7680" height="4320" alt="11" src="https://github.com/user-attachments/assets/89bc5592-eb06-4b3e-a84c-addfb935438f" />
<img width="5760" height="3240" alt="13" src="https://github.com/user-attachments/assets/692cc986-3d0c-4492-9be8-6d2733a17959" />
<img width="7680" height="4320" alt="14" src="https://github.com/user-attachments/assets/709ff36a-e5e3-4423-8c31-7098331c5e66" />
<img width="5760" height="3240" alt="15" src="https://github.com/user-attachments/assets/ea4151b9-7f51-4bb8-9aed-2d46e5d86afd" />
<img width="7680" height="4320" alt="16" src="https://github.com/user-attachments/assets/81c38692-28c8-4471-a491-d34b00d8955e" />

<br>

## 🪴 Branch Convention (GitHub Flow)

- `main`: 배포 가능한 브랜치, 항상 배포 가능한 상태를 유지
- `feature/{description}`: 새로운 기능을 개발하는 브랜치
  - 예: `feature/add-login-page`

### Flow

1. `main` 브랜치에서 새로운 브랜치를 생성.
2. 작업을 완료하고 커밋 메시지에 맞게 커밋.
3. Pull Request를 생성 / 팀원들의 리뷰.
4. 리뷰가 완료되면 `main` 브랜치로 병합.
5. 병합 후, 필요시 배포.
   **예시**:

```bash
# 새로운 기능 개발
git checkout -b feature/add-login-page
# 작업 완료 후, main 브랜치로 병합
git checkout main
git pull origin main
git merge feature/add-login-page
git push origin main
```
