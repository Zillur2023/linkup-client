import { z } from "zod";

export const loginValidationSchema = z.object({
  email: z.string().trim().email("Please enter a valid email"),
  password: z
    .string()
    .trim()
    .min(4, "Password needs to be at lest 4 character"),
});

export const registerValidationSchema = z.object({
  name: z.string().min(1, "Please enter your name!"),
  email: z.string().email("Please enter a valid email address!"),
  password: z.string().min(4, "Must be at least 4 characters."),
});

export const commentValidationSchema = z.object({
  comment: z.string().min(1, "Must be at least 1 character"),
});
export const postEditorValidationSchema = z.object({
  isPremium: z.boolean().optional(),
  content: z.string().optional(),
  // images: z.array(z.instanceof(File)).optional(),
  images: z.any(),
});

// export const postEditorValidationSchema = z.object({
//   isPremium: z.boolean().optional(),
//   content: z
//     .string()
//     .optional()
//     .refine((value) => {
//       if (value === undefined) {
//         return !z.object({ image: z.array(z.instanceof(File)) }).safeParse({ image: [] }).success;
//       }
//       return value || !z.object({ image: z.array(z.instanceof(File)) }).safeParse({ image: [] }).success;
//     }, {
//       message: 'Content or Image is required',
//     }),
//   image: z
//     .array(z.instanceof(File))
//     .optional()
//     .refine((value) => {
//       return (value?.length ?? 0) > 0 || !!z.object({ content: z.string() }).safeParse({ content: '' }).success;
//     }, {
//       message: 'Content or Image is required',
//     }),
// });

// export const postEditorValidationSchema = z
//   .object({
//     isPremium: z.boolean().optional(),
//     content: z.string().optional(),
//     image: z.array(z.instanceof(File)).optional(),
//   })
//   .refine(
//     (data) => data.content || (data.image && data.image.length > 0), // Ensure content or at least one image is provided
//     {
//       message: "Either content or at least one image is required.",
//       path: ["content"], // You can set this to highlight either "content" or "image"
//     }
//   );
