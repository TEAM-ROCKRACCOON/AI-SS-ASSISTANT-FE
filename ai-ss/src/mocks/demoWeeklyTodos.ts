// src/mocks/demoWeeklyTodos.ts

// weekStartDate(월요일) -> 그 주 weeklyTodos 응답
export const demoWeeklyTodosByStartDate: Record<string, any> = {
    // 1주차: 2025-11-03 ~ 2025-11-09
    "2025-11-03": {
        weeklyTodos: [
            {
                date: "2025-11-03",
                todos: [
                    {
                        id: "c101",
                        completed: false,
                        time: "08:00",
                        title: "화장실 - 세면대 청소",
                    },
                    {
                        id: "s101",
                        completed: false,
                        time: "10:00",
                        title: "아침 운동",
                    },
                ],
            },
            {
                date: "2025-11-04",
                todos: [
                    {
                        id: "s102",
                        completed: false,
                        time: "12:30",
                        title: "전공 수업",
                    },
                    {
                        id: "c102",
                        completed: false,
                        time: "20:00",
                        title: "거실 - 테이블 위 정리",
                    },
                    {
                        id: "c103",
                        completed: false,
                        time: "22:00",
                        title: "거실 - 가구 표면 먼지 털기 (먼지털이)",
                    },
                ],
            },
            {
                date: "2025-11-05",
                todos: [
                    {
                        id: "s103",
                        completed: false,
                        time: "10:00",
                        title: "세미나 참석",
                    },
                    {
                        id: "c104",
                        completed: false,
                        time: "18:00",
                        title: "화장실 - 변기 청소",
                    },
                ],
            },
            {
                date: "2025-11-06",
                todos: [
                    {
                        id: "s104",
                        completed: false,
                        time: "07:00",
                        title: "아침 운동",
                    },
                    {
                        id: "c105",
                        completed: false,
                        time: "17:00",
                        title: "주방 - 행주 삶기",
                    },
                    {
                        id: "c106",
                        completed: false,
                        time: "23:00",
                        title: "거실 - 바닥 물걸레질",
                    },
                ],
            },
            {
                date: "2025-11-07",
                todos: [
                    {
                        id: "s105",
                        completed: false,
                        time: "09:30",
                        title: "팀 회의",
                    },
                    {
                        id: "c107",
                        completed: false,
                        time: "18:00",
                        title: "거실 - 가구 표면 먼지 닦기 (물걸레)",
                    },
                    {
                        id: "c108",
                        completed: false,
                        time: "21:00",
                        title: "세탁실 - 세탁기 세제통 씻기",
                    },
                ],
            },
            {
                date: "2025-11-08",
                todos: [
                    {
                        id: "s106",
                        completed: false,
                        time: "10:00",
                        title: "주말 운동",
                    },
                    {
                        id: "c109",
                        completed: false,
                        time: "12:00",
                        title: "전자기기 소독",
                    },
                ],
            },
            {
                date: "2025-11-09",
                todos: [
                    {
                        id: "s107",
                        completed: false,
                        time: "11:00",
                        title: "스터디 수업",
                    },
                    {
                        id: "c110",
                        completed: false,
                        time: "15:00",
                        title: "주방 - 냉장고 유통기한 지난 음식 1개 이상 처분",
                    },
                    {
                        id: "c111",
                        completed: false,
                        time: "16:00",
                        title: "창틀 먼지 닦기",
                    },
                    {
                        id: "c112",
                        completed: false,
                        time: "22:00",
                        title: "쓰레기 배출",
                    },
                    {
                        id: "c113",
                        completed: false,
                        time: "22:30",
                        title: "화장실 - 수납장 내부 정리 및 청소",
                    },
                ],
            },
        ],
    },

    // 2주차: 2025-11-10 ~ 2025-11-16
    "2025-11-10": {
        weeklyTodos: [
            {
                date: "2025-11-10",
                todos: [
                    {
                        id: "s201",
                        completed: false,
                        time: "10:00",
                        title: "아침 운동",
                    },
                    {
                        id: "c201",
                        completed: false,
                        time: "18:00",
                        title: "거실 - 청소기로 바닥 먼지 제거",
                    },
                    {
                        id: "c202",
                        completed: false,
                        time: "21:00",
                        title: "주방 - 수건 교체",
                    },
                ],
            },
            {
                date: "2025-11-11",
                todos: [
                    {
                        id: "s202",
                        completed: false,
                        time: "12:30",
                        title: "전공 수업",
                    },
                    {
                        id: "c203",
                        completed: false,
                        time: "19:00",
                        title: "화장실 - 거울 닦기",
                    },
                    {
                        id: "c204",
                        completed: false,
                        time: "20:00",
                        title: "거실 - 테이블 위 정리",
                    },
                    {
                        id: "c205",
                        completed: false,
                        time: "22:00",
                        title: "창틀 먼지 닦기",
                    },
                ],
            },
            {
                date: "2025-11-12",
                todos: [
                    {
                        id: "s203",
                        completed: false,
                        time: "09:00",
                        title: "세미나 참석",
                    },
                    {
                        id: "c206",
                        completed: false,
                        time: "17:00",
                        title: "화장실 - 변기 청소",
                    },
                ],
            },
            {
                date: "2025-11-13",
                todos: [
                    {
                        id: "s204",
                        completed: false,
                        time: "07:30",
                        title: "아침 운동",
                    },
                    {
                        id: "c207",
                        completed: false,
                        time: "12:00",
                        title: "전자기기 소독",
                    },
                    {
                        id: "c208",
                        completed: false,
                        time: "20:00",
                        title: "거실 - 가구 표면 먼지 털기 (먼지털이)",
                    },
                    {
                        id: "c209",
                        completed: false,
                        time: "22:00",
                        title: "주방 - 행주 삶기",
                    },
                ],
            },
            {
                date: "2025-11-14",
                todos: [
                    {
                        id: "s205",
                        completed: false,
                        time: "11:00",
                        title: "팀 회의",
                    },
                    {
                        id: "c210",
                        completed: false,
                        time: "18:00",
                        title: "쓰레기 배출",
                    },
                ],
            },
            {
                date: "2025-11-15",
                todos: [
                    {
                        id: "c211",
                        completed: false,
                        time: "11:00",
                        title: "음식물 쓰레기 배출",
                    },
                    {
                        id: "c212",
                        completed: false,
                        time: "12:00",
                        title: "거실 - 바닥 물걸레질",
                    },
                    {
                        id: "c213",
                        completed: false,
                        time: "14:00",
                        title: "화장실 - 세면대 청소",
                    },
                    {
                        id: "s206",
                        completed: false,
                        time: "16:00",
                        title: "주말 운동",
                    },
                ],
            },
            {
                date: "2025-11-16",
                todos: [
                    {
                        id: "s207",
                        completed: false,
                        time: "10:00",
                        title: "온라인 수업",
                    },
                    {
                        id: "c214",
                        completed: false,
                        time: "15:00",
                        title: "주방 - 냉장고 유통기한 지난 음식 1개 이상 처분",
                    },
                    {
                        id: "c215",
                        completed: false,
                        time: "20:00",
                        title: "거실 - 안 쓰는 물건 1개 이상 처분",
                    },
                ],
            },
        ],
    },

    // 3주차: 2025-11-17 ~ 2025-11-23
    "2025-11-17": {
        weeklyTodos: [
            {
                date: "2025-11-17",
                todos: [
                    {
                        id: "s301",
                        completed: false,
                        time: "09:00",
                        title: "아침 운동",
                    },
                    {
                        id: "c301",
                        completed: false,
                        time: "11:00",
                        title: "거실 - 청소기로 바닥 먼지 제거",
                    },
                    {
                        id: "c302",
                        completed: false,
                        time: "21:00",
                        title: "주방 - 수건 교체",
                    },
                ],
            },
            {
                date: "2025-11-18",
                todos: [
                    {
                        id: "c303",
                        completed: false,
                        time: "10:00",
                        title: "화장실 - 거울 닦기",
                    },
                    {
                        id: "s302",
                        completed: false,
                        time: "12:00",
                        title: "전공 수업",
                    },
                    {
                        id: "c304",
                        completed: false,
                        time: "19:00",
                        title: "거실 - 테이블 위 정리",
                    },
                ],
            },
            {
                date: "2025-11-19",
                todos: [
                    {
                        id: "s303",
                        completed: false,
                        time: "07:30",
                        title: "세미나 준비 회의",
                    },
                    {
                        id: "c305",
                        completed: false,
                        time: "09:00",
                        title: "화장실 - 변기 청소",
                    },
                    {
                        id: "c306",
                        completed: false,
                        time: "20:00",
                        title: "창틀 먼지 닦기",
                    },
                ],
            },
            {
                date: "2025-11-20",
                todos: [
                    {
                        id: "s304",
                        completed: false,
                        time: "07:00",
                        title: "아침 운동",
                    },
                    {
                        id: "c307",
                        completed: false,
                        time: "09:00",
                        title: "전자기기 소독",
                    },
                    {
                        id: "c308",
                        completed: false,
                        time: "19:00",
                        title: "주방 - 행주 삶기",
                    },
                    {
                        id: "c309",
                        completed: false,
                        time: "20:00",
                        title: "거실 - 가구 표면 먼지 닦기 (물걸레)",
                    },
                ],
            },
            {
                date: "2025-11-21",
                todos: [
                    {
                        id: "s305",
                        completed: false,
                        time: "10:00",
                        title: "팀 회의",
                    },
                ],
            },
            {
                date: "2025-11-22",
                todos: [
                    {
                        id: "s306",
                        completed: false,
                        time: "08:00",
                        title: "주말 운동",
                    },
                    {
                        id: "c310",
                        completed: false,
                        time: "11:00",
                        title: "화장실 - 세면대 청소",
                    },
                    {
                        id: "c311",
                        completed: false,
                        time: "15:00",
                        title: "거실 - 바닥 물걸레질",
                    },
                ],
            },
            {
                date: "2025-11-23",
                todos: [
                    {
                        id: "c312",
                        completed: false,
                        time: "10:00",
                        title: "음식물 쓰레기 배출",
                    },
                    {
                        id: "s307",
                        completed: false,
                        time: "12:30",
                        title: "온라인 수업",
                    },
                    {
                        id: "c313",
                        completed: false,
                        time: "15:00",
                        title: "주방 - 냉장고 유통기한 지난 음식 1개 이상 처분",
                    },
                    {
                        id: "c314",
                        completed: false,
                        time: "20:00",
                        title: "거실 - 안 쓰는 물건 1개 이상 처분",
                    },
                ],
            },
        ],
    },

    // 4주차: 2025-11-24 ~ 2025-11-30
    "2025-11-24": {
        weeklyTodos: [
            {
                date: "2025-11-24",
                todos: [
                    {
                        id: "c401",
                        completed: false,
                        time: "09:00",
                        title: "거실 - 테이블 위 정리",
                    },
                    {
                        id: "s401",
                        completed: false,
                        time: "11:00",
                        title: "전공 수업",
                    },
                    {
                        id: "c402",
                        completed: false,
                        time: "20:00",
                        title: "화장실 - 거울 닦기",
                    },
                ],
            },
            {
                date: "2025-11-25",
                todos: [
                    {
                        id: "s402",
                        completed: false,
                        time: "08:00",
                        title: "아침 운동",
                    },
                    {
                        id: "c403",
                        completed: false,
                        time: "19:00",
                        title: "거실 - 청소기로 바닥 먼지 제거",
                    },
                    {
                        id: "c404",
                        completed: false,
                        time: "21:00",
                        title: "주방 - 수건 교체",
                    },
                    {
                        id: "c405",
                        completed: false,
                        time: "22:00",
                        title: "전자기기 소독",
                    },
                ],
            },
            {
                date: "2025-11-26",
                todos: [
                    {
                        id: "s403",
                        completed: false,
                        time: "10:00",
                        title: "세미나 참석",
                    },
                    {
                        id: "c406",
                        completed: false,
                        time: "17:00",
                        title: "화장실 - 변기 청소",
                    },
                ],
            },
            {
                date: "2025-11-27",
                todos: [
                    {
                        id: "s404",
                        completed: false,
                        time: "07:30",
                        title: "아침 운동",
                    },
                    {
                        id: "c407",
                        completed: false,
                        time: "18:00",
                        title: "거실 - 가구 표면 먼지 털기 (먼지털이)",
                    },
                    {
                        id: "c408",
                        completed: false,
                        time: "19:00",
                        title: "주방 - 행주 삶기",
                    },
                ],
            },
            {
                date: "2025-11-28",
                todos: [
                    {
                        id: "s405",
                        completed: false,
                        time: "09:00",
                        title: "팀 회의",
                    },
                ],
            },
            {
                date: "2025-11-29",
                todos: [
                    {
                        id: "c409",
                        completed: false,
                        time: "11:00",
                        title: "화장실 - 세면대 청소",
                    },
                    {
                        id: "c410",
                        completed: false,
                        time: "12:00",
                        title: "쓰레기 배출",
                    },
                    {
                        id: "c411",
                        completed: false,
                        time: "14:00",
                        title: "거실 - 바닥 물걸레질",
                    },
                    {
                        id: "s406",
                        completed: false,
                        time: "16:00",
                        title: "주말 운동",
                    },
                ],
            },
            {
                date: "2025-11-30",
                todos: [
                    {
                        id: "c412",
                        completed: false,
                        time: "09:00",
                        title: "주방 - 냉장고 유통기한 지난 음식 1개 이상 처분",
                    },
                    {
                        id: "s407",
                        completed: false,
                        time: "11:00",
                        title: "온라인 수업",
                    },
                    {
                        id: "c413",
                        completed: false,
                        time: "18:00",
                        title: "창틀 먼지 닦기",
                    },
                ],
            },
        ],
    },
};
