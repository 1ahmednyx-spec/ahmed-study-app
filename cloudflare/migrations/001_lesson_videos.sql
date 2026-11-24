-- Lesson video links are metadata only; videos remain hosted by YouTube.
CREATE TABLE IF NOT EXISTS public.lesson_videos (
 course_id text NOT NULL,
 unit_index integer NOT NULL CHECK(unit_index BETWEEN 0 AND 100),
 lesson_index integer NOT NULL CHECK(lesson_index BETWEEN 0 AND 100),
 youtube_url text NOT NULL,
 youtube_video_id varchar(11) NOT NULL CHECK(youtube_video_id ~ '^[A-Za-z0-9_-]{11}$'),
 title text,
 created_at timestamptz NOT NULL DEFAULT now(),
 updated_at timestamptz NOT NULL DEFAULT now(),
 PRIMARY KEY(course_id,unit_index,lesson_index)
);
