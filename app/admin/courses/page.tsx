import Link from "next/link";
import {ADMIN_ROUTES} from "@/constants/routes";
import {buttonVariants} from "@/components/ui/button";

export default function CoursesPage() {
    return (
        <>
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold">Your Courses</h1>
                <Link className={buttonVariants()} href={ADMIN_ROUTES.CREATE_COURSE()}>Create Course</Link>
            </div>

            <div>
                <h1>Here you will see all of the courses</h1>
            </div>
        </>
    )
}