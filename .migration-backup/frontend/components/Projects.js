
import { motion } from 'framer-motion';

const projects = [
  {
    title: 'Project One',
    description: 'A brief description of the first project.',
    image: '/project1.jpg',
    liveLink: '#',
    sourceLink: '#',
  },
  {
    title: 'Project Two',
    description: 'A brief description of the second project.',
    image: '/project2.jpg',
    liveLink: '#',
    sourceLink: '#',
  },
  {
    title: 'Project Three',
    description: 'A brief description of the third project.',
    image: '/project3.jpg',
    liveLink: '#',
    sourceLink: '#',
  },
];

const Projects = () => {
  return (
    <section className="py-20 bg-gray-800 text-white">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl font-bold">My Projects</h2>
          <p className="text-lg text-gray-400 mt-2">A selection of my work</p>
        </motion.div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {projects.map((project, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.2 }}
              className="bg-gray-900 rounded-lg overflow-hidden"
            >
              <img src={project.image} alt={project.title} className="w-full h-56 object-cover" />
              <div className="p-6">
                <h3 className="text-2xl font-bold mb-2">{project.title}</h3>
                <p className="text-gray-400 mb-4">{project.description}</p>
                <div className="flex justify-between">
                  <a href={project.liveLink} className="text-purple-500 hover:underline">Live Demo</a>
                  <a href={project.sourceLink} className="text-purple-500 hover:underline">Source Code</a>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Projects;
