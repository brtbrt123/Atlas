// Original ATLAS catalog. Names describe conventional exercises; no third-party catalog data.
// Stable identities: retain existing IDs and builtinKey values when adding catalog entries.
import type { ExerciseInput } from '../../types';

export type BuiltinExercise = Required<ExerciseInput> & { id: string; builtinKey: string };

export const BUILTIN_EXERCISES: readonly BuiltinExercise[] = [
  {
    "id": "b9cf79c8-b82f-426f-9c53-2772b7d15d32",
    "builtinKey": "barbell_bench_press",
    "name": "Barbell bench press",
    "equipment": "barbell",
    "trackingType": "weight_reps",
    "notes": null,
    "muscles": [
      {
        "muscle": "chest",
        "role": "primary"
      },
      {
        "muscle": "triceps",
        "role": "secondary"
      },
      {
        "muscle": "shoulders",
        "role": "secondary"
      }
    ]
  },
  {
    "id": "321e785a-65e8-471f-89f0-17797e456cfa",
    "builtinKey": "incline_dumbbell_press",
    "name": "Incline dumbbell press",
    "equipment": "dumbbell",
    "trackingType": "weight_reps",
    "notes": null,
    "muscles": [
      {
        "muscle": "chest",
        "role": "primary"
      },
      {
        "muscle": "triceps",
        "role": "secondary"
      },
      {
        "muscle": "shoulders",
        "role": "secondary"
      }
    ]
  },
  {
    "id": "58bb16d7-1c3f-489c-8257-2e014343518b",
    "builtinKey": "dumbbell_bench_press",
    "name": "Dumbbell bench press",
    "equipment": "dumbbell",
    "trackingType": "weight_reps",
    "notes": null,
    "muscles": [
      {
        "muscle": "chest",
        "role": "primary"
      },
      {
        "muscle": "triceps",
        "role": "secondary"
      },
      {
        "muscle": "shoulders",
        "role": "secondary"
      }
    ]
  },
  {
    "id": "e723366a-34fe-4211-a787-3e4327a33ff5",
    "builtinKey": "cable_crossover",
    "name": "Cable crossover",
    "equipment": "cable",
    "trackingType": "weight_reps",
    "notes": null,
    "muscles": [
      {
        "muscle": "chest",
        "role": "primary"
      },
      {
        "muscle": "shoulders",
        "role": "secondary"
      }
    ]
  },
  {
    "id": "00747114-7039-4830-830f-5f6244ea4427",
    "builtinKey": "machine_chest_press",
    "name": "Machine chest press",
    "equipment": "machine",
    "trackingType": "weight_reps",
    "notes": null,
    "muscles": [
      {
        "muscle": "chest",
        "role": "primary"
      },
      {
        "muscle": "triceps",
        "role": "secondary"
      },
      {
        "muscle": "shoulders",
        "role": "secondary"
      }
    ]
  },
  {
    "id": "cf3d9033-4509-4c4f-9009-e0b4fc315839",
    "builtinKey": "push_up",
    "name": "Push-up",
    "equipment": "bodyweight",
    "trackingType": "bodyweight_reps",
    "notes": null,
    "muscles": [
      {
        "muscle": "chest",
        "role": "primary"
      },
      {
        "muscle": "triceps",
        "role": "secondary"
      },
      {
        "muscle": "shoulders",
        "role": "secondary"
      }
    ]
  },
  {
    "id": "623d4fcc-35e9-4193-ae31-3c1aebeb8c81",
    "builtinKey": "kettlebell_floor_press",
    "name": "Kettlebell floor press",
    "equipment": "kettlebell",
    "trackingType": "weight_reps",
    "notes": null,
    "muscles": [
      {
        "muscle": "chest",
        "role": "primary"
      },
      {
        "muscle": "triceps",
        "role": "secondary"
      }
    ]
  },
  {
    "id": "f7e2df6f-bde8-40ad-b2c2-7f267248b569",
    "builtinKey": "chest_dip",
    "name": "Chest dip",
    "equipment": "dip_station",
    "trackingType": "bodyweight_reps",
    "notes": null,
    "muscles": [
      {
        "muscle": "chest",
        "role": "primary"
      },
      {
        "muscle": "triceps",
        "role": "secondary"
      },
      {
        "muscle": "shoulders",
        "role": "secondary"
      }
    ]
  },
  {
    "id": "67a3ae96-0ff8-457a-ac4e-4617b091dc2e",
    "builtinKey": "barbell_row",
    "name": "Barbell row",
    "equipment": "barbell",
    "trackingType": "weight_reps",
    "notes": null,
    "muscles": [
      {
        "muscle": "upper_back",
        "role": "primary"
      },
      {
        "muscle": "lats",
        "role": "secondary"
      },
      {
        "muscle": "biceps",
        "role": "secondary"
      },
      {
        "muscle": "lower_back",
        "role": "secondary"
      }
    ]
  },
  {
    "id": "95f83656-010f-4d98-a8dd-2c2d317114c5",
    "builtinKey": "seated_cable_row",
    "name": "Seated cable row",
    "equipment": "cable",
    "trackingType": "weight_reps",
    "notes": null,
    "muscles": [
      {
        "muscle": "upper_back",
        "role": "primary"
      },
      {
        "muscle": "lats",
        "role": "secondary"
      },
      {
        "muscle": "biceps",
        "role": "secondary"
      }
    ]
  },
  {
    "id": "db9d8731-4897-4011-9ac1-33f4c3068df4",
    "builtinKey": "dumbbell_row",
    "name": "Dumbbell row",
    "equipment": "dumbbell",
    "trackingType": "weight_reps",
    "notes": null,
    "muscles": [
      {
        "muscle": "lats",
        "role": "primary"
      },
      {
        "muscle": "upper_back",
        "role": "secondary"
      },
      {
        "muscle": "biceps",
        "role": "secondary"
      }
    ]
  },
  {
    "id": "e17611db-c4b7-45d6-9365-8d345bcc1299",
    "builtinKey": "lat_pulldown",
    "name": "Lat pulldown",
    "equipment": "cable",
    "trackingType": "weight_reps",
    "notes": null,
    "muscles": [
      {
        "muscle": "lats",
        "role": "primary"
      },
      {
        "muscle": "biceps",
        "role": "secondary"
      },
      {
        "muscle": "upper_back",
        "role": "secondary"
      }
    ]
  },
  {
    "id": "5bbe09f6-3b89-4900-b87c-9b1ea7286d6b",
    "builtinKey": "pull_up",
    "name": "Pull-up",
    "equipment": "pull_up_bar",
    "trackingType": "bodyweight_reps",
    "notes": null,
    "muscles": [
      {
        "muscle": "lats",
        "role": "primary"
      },
      {
        "muscle": "biceps",
        "role": "secondary"
      },
      {
        "muscle": "upper_back",
        "role": "secondary"
      }
    ]
  },
  {
    "id": "81fde358-98c3-402a-80c8-5a79a843cf91",
    "builtinKey": "chin_up",
    "name": "Chin-up",
    "equipment": "pull_up_bar",
    "trackingType": "bodyweight_reps",
    "notes": null,
    "muscles": [
      {
        "muscle": "lats",
        "role": "primary"
      },
      {
        "muscle": "biceps",
        "role": "secondary"
      },
      {
        "muscle": "forearms",
        "role": "secondary"
      }
    ]
  },
  {
    "id": "ab6fb6b6-70e1-4dab-8b31-c073ebf57f00",
    "builtinKey": "suspension_row",
    "name": "Suspension row",
    "equipment": "suspension",
    "trackingType": "bodyweight_reps",
    "notes": null,
    "muscles": [
      {
        "muscle": "upper_back",
        "role": "primary"
      },
      {
        "muscle": "lats",
        "role": "secondary"
      },
      {
        "muscle": "biceps",
        "role": "secondary"
      }
    ]
  },
  {
    "id": "9630864d-7150-4640-ba69-6824a430acb4",
    "builtinKey": "back_extension",
    "name": "Back extension",
    "equipment": "bodyweight",
    "trackingType": "bodyweight_reps",
    "notes": null,
    "muscles": [
      {
        "muscle": "lower_back",
        "role": "primary"
      },
      {
        "muscle": "glutes",
        "role": "secondary"
      },
      {
        "muscle": "hamstrings",
        "role": "secondary"
      }
    ]
  },
  {
    "id": "598a2bf6-f25b-4bd0-8f93-c28999b9bf55",
    "builtinKey": "dumbbell_shrug",
    "name": "Dumbbell shrug",
    "equipment": "dumbbell",
    "trackingType": "weight_reps",
    "notes": null,
    "muscles": [
      {
        "muscle": "traps",
        "role": "primary"
      },
      {
        "muscle": "forearms",
        "role": "secondary"
      }
    ]
  },
  {
    "id": "58637da4-d3d8-49a5-aa6c-5d22898a162c",
    "builtinKey": "cable_face_pull",
    "name": "Cable face pull",
    "equipment": "cable",
    "trackingType": "weight_reps",
    "notes": null,
    "muscles": [
      {
        "muscle": "shoulders",
        "role": "primary"
      },
      {
        "muscle": "traps",
        "role": "secondary"
      },
      {
        "muscle": "upper_back",
        "role": "secondary"
      }
    ]
  },
  {
    "id": "60786804-c453-486e-9fe6-9471ca73d8c7",
    "builtinKey": "barbell_overhead_press",
    "name": "Barbell overhead press",
    "equipment": "barbell",
    "trackingType": "weight_reps",
    "notes": null,
    "muscles": [
      {
        "muscle": "shoulders",
        "role": "primary"
      },
      {
        "muscle": "triceps",
        "role": "secondary"
      }
    ]
  },
  {
    "id": "cac93c47-2a6c-4dd0-8478-aca2c9ba6086",
    "builtinKey": "dumbbell_shoulder_press",
    "name": "Dumbbell shoulder press",
    "equipment": "dumbbell",
    "trackingType": "weight_reps",
    "notes": null,
    "muscles": [
      {
        "muscle": "shoulders",
        "role": "primary"
      },
      {
        "muscle": "triceps",
        "role": "secondary"
      }
    ]
  },
  {
    "id": "861def57-c8f5-4653-bbb8-2a79afd4187d",
    "builtinKey": "dumbbell_lateral_raise",
    "name": "Dumbbell lateral raise",
    "equipment": "dumbbell",
    "trackingType": "weight_reps",
    "notes": null,
    "muscles": [
      {
        "muscle": "shoulders",
        "role": "primary"
      }
    ]
  },
  {
    "id": "23304358-a431-4d8a-b5ad-1f97e989c91f",
    "builtinKey": "dumbbell_reverse_fly",
    "name": "Dumbbell reverse fly",
    "equipment": "dumbbell",
    "trackingType": "weight_reps",
    "notes": null,
    "muscles": [
      {
        "muscle": "shoulders",
        "role": "primary"
      },
      {
        "muscle": "upper_back",
        "role": "secondary"
      }
    ]
  },
  {
    "id": "363877c8-02c4-4a6c-9e0b-78812bfff12a",
    "builtinKey": "landmine_press",
    "name": "Landmine press",
    "equipment": "landmine",
    "trackingType": "weight_reps",
    "notes": null,
    "muscles": [
      {
        "muscle": "shoulders",
        "role": "primary"
      },
      {
        "muscle": "chest",
        "role": "secondary"
      },
      {
        "muscle": "triceps",
        "role": "secondary"
      }
    ]
  },
  {
    "id": "c6586cba-4d2e-47f3-b3ab-a78ebfca8d96",
    "builtinKey": "barbell_curl",
    "name": "Barbell curl",
    "equipment": "barbell",
    "trackingType": "weight_reps",
    "notes": null,
    "muscles": [
      {
        "muscle": "biceps",
        "role": "primary"
      },
      {
        "muscle": "forearms",
        "role": "secondary"
      }
    ]
  },
  {
    "id": "ee77d5da-9a3b-411a-807c-c4b8822407d5",
    "builtinKey": "ez_bar_curl",
    "name": "EZ-bar curl",
    "equipment": "ez_bar",
    "trackingType": "weight_reps",
    "notes": null,
    "muscles": [
      {
        "muscle": "biceps",
        "role": "primary"
      },
      {
        "muscle": "forearms",
        "role": "secondary"
      }
    ]
  },
  {
    "id": "6e1d0cb3-de95-45da-9d35-f55fa65f65dd",
    "builtinKey": "dumbbell_hammer_curl",
    "name": "Dumbbell hammer curl",
    "equipment": "dumbbell",
    "trackingType": "weight_reps",
    "notes": null,
    "muscles": [
      {
        "muscle": "biceps",
        "role": "primary"
      },
      {
        "muscle": "forearms",
        "role": "secondary"
      }
    ]
  },
  {
    "id": "8a9a592c-c72c-440a-970a-ecb76e1fec22",
    "builtinKey": "cable_curl",
    "name": "Cable curl",
    "equipment": "cable",
    "trackingType": "weight_reps",
    "notes": null,
    "muscles": [
      {
        "muscle": "biceps",
        "role": "primary"
      }
    ]
  },
  {
    "id": "3c394537-214c-4da6-b378-4cf40ec4ddee",
    "builtinKey": "cable_triceps_pushdown",
    "name": "Cable triceps pushdown",
    "equipment": "cable",
    "trackingType": "weight_reps",
    "notes": null,
    "muscles": [
      {
        "muscle": "triceps",
        "role": "primary"
      }
    ]
  },
  {
    "id": "b3803e48-f3a6-417e-8546-0ae664b900d3",
    "builtinKey": "dumbbell_triceps_extension",
    "name": "Dumbbell triceps extension",
    "equipment": "dumbbell",
    "trackingType": "weight_reps",
    "notes": null,
    "muscles": [
      {
        "muscle": "triceps",
        "role": "primary"
      }
    ]
  },
  {
    "id": "e5d8aab4-7dc0-4133-aff6-cd27dd826ade",
    "builtinKey": "wrist_curl",
    "name": "Wrist curl",
    "equipment": "dumbbell",
    "trackingType": "weight_reps",
    "notes": null,
    "muscles": [
      {
        "muscle": "forearms",
        "role": "primary"
      }
    ]
  },
  {
    "id": "ba92c30f-4f68-4794-af66-96bd15fd493d",
    "builtinKey": "barbell_squat",
    "name": "Barbell squat",
    "equipment": "barbell",
    "trackingType": "weight_reps",
    "notes": null,
    "muscles": [
      {
        "muscle": "quadriceps",
        "role": "primary"
      },
      {
        "muscle": "glutes",
        "role": "secondary"
      },
      {
        "muscle": "adductors",
        "role": "secondary"
      }
    ]
  },
  {
    "id": "8ecb1799-f7c7-4a79-8412-b81a284d9aea",
    "builtinKey": "goblet_squat",
    "name": "Goblet squat",
    "equipment": "kettlebell",
    "trackingType": "weight_reps",
    "notes": null,
    "muscles": [
      {
        "muscle": "quadriceps",
        "role": "primary"
      },
      {
        "muscle": "glutes",
        "role": "secondary"
      }
    ]
  },
  {
    "id": "397f4022-108a-4da8-ac33-d3dc7dfe3f8a",
    "builtinKey": "smith_machine_squat",
    "name": "Smith machine squat",
    "equipment": "smith_machine",
    "trackingType": "weight_reps",
    "notes": null,
    "muscles": [
      {
        "muscle": "quadriceps",
        "role": "primary"
      },
      {
        "muscle": "glutes",
        "role": "secondary"
      }
    ]
  },
  {
    "id": "fb68e9bd-be24-4f40-af24-35dce3a446d4",
    "builtinKey": "leg_press",
    "name": "Leg press",
    "equipment": "machine",
    "trackingType": "weight_reps",
    "notes": null,
    "muscles": [
      {
        "muscle": "quadriceps",
        "role": "primary"
      },
      {
        "muscle": "glutes",
        "role": "secondary"
      },
      {
        "muscle": "adductors",
        "role": "secondary"
      }
    ]
  },
  {
    "id": "e5d49cfe-f285-49d7-945e-2346061b9841",
    "builtinKey": "leg_extension",
    "name": "Leg extension",
    "equipment": "machine",
    "trackingType": "weight_reps",
    "notes": null,
    "muscles": [
      {
        "muscle": "quadriceps",
        "role": "primary"
      }
    ]
  },
  {
    "id": "55a43e14-a441-4dfb-91ca-8887158d6911",
    "builtinKey": "dumbbell_reverse_lunge",
    "name": "Dumbbell reverse lunge",
    "equipment": "dumbbell",
    "trackingType": "weight_reps",
    "notes": null,
    "muscles": [
      {
        "muscle": "quadriceps",
        "role": "primary"
      },
      {
        "muscle": "glutes",
        "role": "secondary"
      },
      {
        "muscle": "hamstrings",
        "role": "secondary"
      }
    ]
  },
  {
    "id": "1987d338-066e-401b-9b72-96e94ebdfa6d",
    "builtinKey": "bodyweight_squat",
    "name": "Bodyweight squat",
    "equipment": "bodyweight",
    "trackingType": "bodyweight_reps",
    "notes": null,
    "muscles": [
      {
        "muscle": "quadriceps",
        "role": "primary"
      },
      {
        "muscle": "glutes",
        "role": "secondary"
      }
    ]
  },
  {
    "id": "02ab55da-ac1b-4e40-abab-b196a47e3ecd",
    "builtinKey": "barbell_romanian_deadlift",
    "name": "Barbell Romanian deadlift",
    "equipment": "barbell",
    "trackingType": "weight_reps",
    "notes": null,
    "muscles": [
      {
        "muscle": "hamstrings",
        "role": "primary"
      },
      {
        "muscle": "glutes",
        "role": "secondary"
      },
      {
        "muscle": "lower_back",
        "role": "secondary"
      }
    ]
  },
  {
    "id": "a0de53c3-72c8-4de4-9ca3-057594425cd5",
    "builtinKey": "trap_bar_deadlift",
    "name": "Trap-bar deadlift",
    "equipment": "trap_bar",
    "trackingType": "weight_reps",
    "notes": null,
    "muscles": [
      {
        "muscle": "glutes",
        "role": "primary"
      },
      {
        "muscle": "quadriceps",
        "role": "primary"
      },
      {
        "muscle": "hamstrings",
        "role": "secondary"
      },
      {
        "muscle": "lower_back",
        "role": "secondary"
      },
      {
        "muscle": "traps",
        "role": "secondary"
      }
    ]
  },
  {
    "id": "1793d495-b129-4c55-b244-df546e291c50",
    "builtinKey": "barbell_deadlift",
    "name": "Barbell deadlift",
    "equipment": "barbell",
    "trackingType": "weight_reps",
    "notes": null,
    "muscles": [
      {
        "muscle": "glutes",
        "role": "primary"
      },
      {
        "muscle": "hamstrings",
        "role": "primary"
      },
      {
        "muscle": "lower_back",
        "role": "secondary"
      },
      {
        "muscle": "quadriceps",
        "role": "secondary"
      },
      {
        "muscle": "traps",
        "role": "secondary"
      }
    ]
  },
  {
    "id": "73d174f3-00dc-4495-9c61-a9078ace5d16",
    "builtinKey": "seated_leg_curl",
    "name": "Seated leg curl",
    "equipment": "machine",
    "trackingType": "weight_reps",
    "notes": null,
    "muscles": [
      {
        "muscle": "hamstrings",
        "role": "primary"
      }
    ]
  },
  {
    "id": "f072311d-a066-4958-a48d-0552ae6ebe8a",
    "builtinKey": "barbell_hip_thrust",
    "name": "Barbell hip thrust",
    "equipment": "barbell",
    "trackingType": "weight_reps",
    "notes": null,
    "muscles": [
      {
        "muscle": "glutes",
        "role": "primary"
      },
      {
        "muscle": "hamstrings",
        "role": "secondary"
      }
    ]
  },
  {
    "id": "6cf1b1df-4724-4853-aa3a-87ed81cb1d25",
    "builtinKey": "glute_bridge",
    "name": "Glute bridge",
    "equipment": "bodyweight",
    "trackingType": "bodyweight_reps",
    "notes": null,
    "muscles": [
      {
        "muscle": "glutes",
        "role": "primary"
      },
      {
        "muscle": "hamstrings",
        "role": "secondary"
      }
    ]
  },
  {
    "id": "b33d949d-d41d-4224-8017-3cfb7bd17513",
    "builtinKey": "kettlebell_swing",
    "name": "Kettlebell swing",
    "equipment": "kettlebell",
    "trackingType": "weight_reps",
    "notes": null,
    "muscles": [
      {
        "muscle": "glutes",
        "role": "primary"
      },
      {
        "muscle": "hamstrings",
        "role": "primary"
      },
      {
        "muscle": "lower_back",
        "role": "secondary"
      }
    ]
  },
  {
    "id": "433d47f5-39c0-4969-b9d7-f73c536721d5",
    "builtinKey": "standing_calf_raise",
    "name": "Standing calf raise",
    "equipment": "machine",
    "trackingType": "weight_reps",
    "notes": null,
    "muscles": [
      {
        "muscle": "calves",
        "role": "primary"
      }
    ]
  },
  {
    "id": "392029e7-2efa-42af-af75-22f8943bc23a",
    "builtinKey": "seated_calf_raise",
    "name": "Seated calf raise",
    "equipment": "machine",
    "trackingType": "weight_reps",
    "notes": null,
    "muscles": [
      {
        "muscle": "calves",
        "role": "primary"
      }
    ]
  },
  {
    "id": "c0f0e012-2eca-4abf-8a48-a70ba37b0723",
    "builtinKey": "hip_adduction",
    "name": "Hip adduction",
    "equipment": "machine",
    "trackingType": "weight_reps",
    "notes": null,
    "muscles": [
      {
        "muscle": "adductors",
        "role": "primary"
      }
    ]
  },
  {
    "id": "f8d80024-73a4-4e23-b3c0-cd5d7e4402cf",
    "builtinKey": "hip_abduction",
    "name": "Hip abduction",
    "equipment": "machine",
    "trackingType": "weight_reps",
    "notes": null,
    "muscles": [
      {
        "muscle": "abductors",
        "role": "primary"
      },
      {
        "muscle": "glutes",
        "role": "secondary"
      }
    ]
  },
  {
    "id": "13b91c03-3e6f-467a-ba7d-036aa08233b5",
    "builtinKey": "band_lateral_walk",
    "name": "Band lateral walk",
    "equipment": "resistance_band",
    "trackingType": "bodyweight_reps",
    "notes": null,
    "muscles": [
      {
        "muscle": "abductors",
        "role": "primary"
      },
      {
        "muscle": "glutes",
        "role": "secondary"
      }
    ]
  },
  {
    "id": "5ce45791-4f40-4654-8538-fb6cb011453f",
    "builtinKey": "hanging_knee_raise",
    "name": "Hanging knee raise",
    "equipment": "pull_up_bar",
    "trackingType": "bodyweight_reps",
    "notes": null,
    "muscles": [
      {
        "muscle": "hip_flexors",
        "role": "primary"
      },
      {
        "muscle": "abs",
        "role": "primary"
      }
    ]
  },
  {
    "id": "73c1cd08-297f-452d-b82e-0f5c0386f887",
    "builtinKey": "crunch",
    "name": "Crunch",
    "equipment": "bodyweight",
    "trackingType": "bodyweight_reps",
    "notes": null,
    "muscles": [
      {
        "muscle": "abs",
        "role": "primary"
      }
    ]
  },
  {
    "id": "ef2a2425-7f1f-4025-874a-2ddd7e042a29",
    "builtinKey": "dead_bug",
    "name": "Dead bug",
    "equipment": "bodyweight",
    "trackingType": "bodyweight_reps",
    "notes": null,
    "muscles": [
      {
        "muscle": "abs",
        "role": "primary"
      },
      {
        "muscle": "hip_flexors",
        "role": "secondary"
      }
    ]
  },
  {
    "id": "ba52a429-39ca-4457-8db8-7955000c6b7a",
    "builtinKey": "plank",
    "name": "Plank",
    "equipment": "bodyweight",
    "trackingType": "duration",
    "notes": null,
    "muscles": [
      {
        "muscle": "abs",
        "role": "primary"
      },
      {
        "muscle": "shoulders",
        "role": "secondary"
      }
    ]
  },
  {
    "id": "6a69fd1c-8156-4325-a5c7-1328175505d6",
    "builtinKey": "side_plank",
    "name": "Side plank",
    "equipment": "bodyweight",
    "trackingType": "duration",
    "notes": null,
    "muscles": [
      {
        "muscle": "obliques",
        "role": "primary"
      },
      {
        "muscle": "abs",
        "role": "secondary"
      }
    ]
  },
  {
    "id": "88093b20-2411-44d9-8ad0-8f9e758ca162",
    "builtinKey": "cable_wood_chop",
    "name": "Cable wood chop",
    "equipment": "cable",
    "trackingType": "weight_reps",
    "notes": null,
    "muscles": [
      {
        "muscle": "obliques",
        "role": "primary"
      },
      {
        "muscle": "abs",
        "role": "secondary"
      }
    ]
  },
  {
    "id": "019c0bdf-562e-41c0-ab58-6ed66aea78ce",
    "builtinKey": "plate_russian_twist",
    "name": "Plate Russian twist",
    "equipment": "plate",
    "trackingType": "weight_reps",
    "notes": null,
    "muscles": [
      {
        "muscle": "obliques",
        "role": "primary"
      },
      {
        "muscle": "abs",
        "role": "secondary"
      }
    ]
  },
  {
    "id": "4c2c003c-5cb5-44dc-a8c8-c4945dc5860a",
    "builtinKey": "farmer_hold",
    "name": "Farmer hold",
    "equipment": "dumbbell",
    "trackingType": "duration",
    "notes": null,
    "muscles": [
      {
        "muscle": "forearms",
        "role": "primary"
      },
      {
        "muscle": "traps",
        "role": "secondary"
      },
      {
        "muscle": "abs",
        "role": "secondary"
      }
    ]
  },
  {
    "id": "ef30cb72-dbba-4866-b55b-6b2dce07dab4",
    "builtinKey": "neck_flexion_isometric",
    "name": "Neck flexion isometric",
    "equipment": "bodyweight",
    "trackingType": "duration",
    "notes": null,
    "muscles": [
      {
        "muscle": "neck",
        "role": "primary"
      }
    ]
  },
  {
    "id": "278cf7ff-05be-48c4-a725-b6a30cd8255a",
    "builtinKey": "medicine_ball_slam",
    "name": "Medicine ball slam",
    "equipment": "medicine_ball",
    "trackingType": "bodyweight_reps",
    "notes": null,
    "muscles": [
      {
        "muscle": "abs",
        "role": "primary"
      },
      {
        "muscle": "lats",
        "role": "primary"
      },
      {
        "muscle": "shoulders",
        "role": "secondary"
      }
    ]
  },
  {
    "id": "77522ddd-294e-46df-9fc9-e0c435b336a3",
    "builtinKey": "sled_push",
    "name": "Sled push",
    "equipment": "sled",
    "trackingType": "distance_duration",
    "notes": null,
    "muscles": [
      {
        "muscle": "quadriceps",
        "role": "primary"
      },
      {
        "muscle": "glutes",
        "role": "primary"
      },
      {
        "muscle": "calves",
        "role": "secondary"
      }
    ]
  },
  {
    "id": "23aa128d-5350-4f9d-9bae-d9ef9fffd420",
    "builtinKey": "treadmill_walk",
    "name": "Treadmill walk",
    "equipment": "cardio_machine",
    "trackingType": "distance_duration",
    "notes": null,
    "muscles": [
      {
        "muscle": "quadriceps",
        "role": "primary"
      },
      {
        "muscle": "glutes",
        "role": "primary"
      },
      {
        "muscle": "hamstrings",
        "role": "secondary"
      },
      {
        "muscle": "calves",
        "role": "secondary"
      }
    ]
  },
  {
    "id": "2ddaa9c3-91d3-4a5f-9d01-2161d987632c",
    "builtinKey": "stationary_bike",
    "name": "Stationary bike",
    "equipment": "cardio_machine",
    "trackingType": "duration",
    "notes": null,
    "muscles": [
      {
        "muscle": "quadriceps",
        "role": "primary"
      },
      {
        "muscle": "glutes",
        "role": "secondary"
      },
      {
        "muscle": "calves",
        "role": "secondary"
      }
    ]
  },
  {
    "id": "b7cad46e-e44d-4a5c-a613-029421be5333",
    "builtinKey": "rowing_machine",
    "name": "Rowing machine",
    "equipment": "cardio_machine",
    "trackingType": "distance_duration",
    "notes": null,
    "muscles": [
      {
        "muscle": "quadriceps",
        "role": "primary"
      },
      {
        "muscle": "upper_back",
        "role": "primary"
      },
      {
        "muscle": "lats",
        "role": "secondary"
      },
      {
        "muscle": "hamstrings",
        "role": "secondary"
      },
      {
        "muscle": "biceps",
        "role": "secondary"
      }
    ]
  },
  {
    "id": "603e16ad-34b5-4010-9a23-63dc05c0eb98",
    "builtinKey": "elliptical_trainer",
    "name": "Elliptical trainer",
    "equipment": "cardio_machine",
    "trackingType": "duration",
    "notes": null,
    "muscles": [
      {
        "muscle": "quadriceps",
        "role": "primary"
      },
      {
        "muscle": "glutes",
        "role": "primary"
      },
      {
        "muscle": "hamstrings",
        "role": "secondary"
      },
      {
        "muscle": "calves",
        "role": "secondary"
      }
    ]
  },
  {
    "id": "a7d8665e-3280-440e-855d-b8f9d1b76c0f",
    "builtinKey": "battle_ropes",
    "name": "Battle ropes",
    "equipment": "other",
    "trackingType": "duration",
    "notes": null,
    "muscles": [
      {
        "muscle": "shoulders",
        "role": "primary"
      },
      {
        "muscle": "forearms",
        "role": "secondary"
      },
      {
        "muscle": "abs",
        "role": "secondary"
      }
    ]
  }
];
