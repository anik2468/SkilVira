import { useEffect, useState } from "react";
import { FiStar } from "react-icons/fi";

const testimonials = [
  {
    id: 1,
    name: "Rahul Kumar",
    college: "NIT Patna",
    image: "https://i.pravatar.cc/150?img=1",
    review:
      "SkilVira helped me get my first internship. The application process was simple and smooth.",
  },
  {
    id: 2,
    name: "Priya Sharma",
    college: "IIT Patna",
    image: "https://i.pravatar.cc/150?img=5",
    review:
      "I found an amazing remote internship through SkilVira. Highly recommended!",
  },
  {
    id: 3,
    name: "Ankit Singh",
    college: "GEC Sheikhpura",
    image: "https://i.pravatar.cc/150?img=8",
    review:
      "The platform is clean, fast, and very student friendly. Loved the experience.",
  },
];

const Testimonials = () => {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % testimonials.length);
    }, 4000);

    return () => clearInterval(interval);
  }, []);

  const testimonial = testimonials[current];

  return (
    <section className="bg-white py-20">
      <div className="mx-auto max-w-4xl px-6">

        <div className="mb-12 text-center">
          <h2 className="text-4xl font-bold">
            What Students Say
          </h2>

          <p className="mt-4 text-gray-600">
            Trusted by students from different colleges across India.
          </p>
        </div>

        <div className="rounded-3xl bg-slate-50 p-10 text-center shadow-lg transition-all">

          <img
            src={testimonial.image}
            alt={testimonial.name}
            className="mx-auto h-24 w-24 rounded-full"
          />

          <div className="mt-6 flex justify-center gap-1">
            {[1, 2, 3, 4, 5].map((star) => (
              <FiStar
                key={star}
                className="fill-yellow-400 text-yellow-400"
              />
            ))}
          </div>

          <p className="mt-8 text-lg leading-8 text-gray-600 italic">
            "{testimonial.review}"
          </p>

          <h3 className="mt-8 text-2xl font-bold">
            {testimonial.name}
          </h3>

          <p className="text-gray-500">
            {testimonial.college}
          </p>

        </div>

      </div>
    </section>
  );
};

export default Testimonials;