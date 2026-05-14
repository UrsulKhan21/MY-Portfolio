
import { motion } from 'framer-motion';
import { CheckCircle } from 'lucide-react';

const skills = [
  'React',
  'Next.js',
  'Node.js',
  'Express',
  'MongoDB',
  'Python',
  'Flask',
  'JavaScript',
  'TypeScript',
  'HTML5',
  'CSS3',
  'Tailwind CSS',
];

const Skills = () => {
  return (
    <section className="py-20 bg-gray-900 text-white">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl font-bold">My Skills</h2>
          <p className="text-lg text-gray-400 mt-2">The technologies I work with</p>
        </motion.div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
          {skills.map((skill, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="flex items-center space-x-4 bg-gray-800 p-4 rounded-lg"
            >
              <CheckCircle className="text-purple-500" />
              <span className="text-lg">{skill}</span>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Skills;
