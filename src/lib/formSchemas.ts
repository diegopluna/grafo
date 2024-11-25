import { z } from "zod";

export const addNodeFormSchema = z.object({
  name: z.string().min(1, {
    message: "O nome do vértice é obrigatório",
  })
})

export type AddNodeForm = z.infer<typeof addNodeFormSchema>