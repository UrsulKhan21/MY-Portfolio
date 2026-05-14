
import { motion } from 'framer-motion';

const About = () => {
  return (
    <section className="py-20 bg-gray-800 text-white">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl font-bold">About Me</h2>
          <p className="text-lg text-gray-400 mt-2">A little bit about my journey</p>
        </motion.div>
        <div className="flex flex-col md:flex-row items-center">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="md:w-1/2 mb-8 md:mb-0"
          >
            <img src="/placeholder.jpg" alt="Abdur Ursul Khan" className="rounded-full w-64 h-64 mx-auto" />
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="md:w-1/2 text-center md:text-left"
          >
            <p className="text-xl mb-4">
              I am a Full Stack Developer with a strong passion for building beautiful and user-friendly web applications. I have experience in both front-end and back-end development, and I am always eager to learn new technologies and improve my skills.
            </p>
            <p className="text-xl">
              My goal is to create meaningful and impactful digital experiences that users will love. I am a highly motivated and dedicated individual, and I am always up for a challenge.
            </p>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default About;
