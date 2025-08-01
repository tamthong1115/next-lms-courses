import {z} from "zod";

export const courseLevels = ["Beginner", "Intermediate", "Advanced"] as const;
export const courseStatus = ["Draft", "Published", "Archived"] as const;

export const courseCategories = [
    "Programming",
    "Design",
    "Marketing",
    "Business",
    "Photography",
    "Music",
    "Language",
    "Health & Fitness",
    "Personal Development",
    "Finance",
    "AI & Machine Learning",
    "Data Science",
    "Web Development",
    "Mobile Development",
    "Game Development",
    "Cybersecurity",
    "DevOps",
    "UI/UX",
    "Cloud Computing",
    "Networking",
    "Engineering",
    "Mathematics",
    "Science",
    "Test Preparation",
    "Teaching & Academics",
    "Human Resources",
    "Project Management",
    "Leadership",
    "Communication Skills",
    "Writing",
    "Career Development",
    "Productivity",
    "Art & Illustration",
    "3D & Animation",
    "Video Production",
    "Cooking",
    "Lifestyle",
    "Travel",
    "Parenting",
    "Pet Care"
] as const;


export const courseSchema = z.object({
    title: z.string()
        .min(3, {message: "Title must be at least 3 characters long"})
        .max(100, {message: "Title must be at most 100 characters long"}),
    description: z.string()
        .min(3, {message: "Description must be at least 3 characters long"}),
    fileKey: z.string()
        .min(1, {message: "File key is required"}),
    price: z.coerce.number()
        .min(1, {message: "Price must be at least 1"}),
    duration: z.coerce.number()
        .min(1, {message: "Duration must be at least 1 minute"}),
    level: z.enum(courseLevels, {message: "Level must be one of Beginner, Intermediate, or Advanced"}),
    category: z.enum(courseCategories, {
        message: "Category is required"
    }),
    smallDescription: z.string()
        .min(3, {message: "Short description must be at least 3 characters long"})
        .max(200, {message: "Short description must be at most 200 characters long"}),
    slug: z.string()
        .min(3, {message: "Slug must be at least 3 characters long"}),
    status: z.enum(courseStatus, {message: "Status must be Draft, Published, or Archived"}),
});

export type CourseSchemaType = z.infer<typeof courseSchema>