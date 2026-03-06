import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const getProjects = async (req, res) => {
  try {
    const projects = await prisma.project.findMany({
      where: { userId: req.userId },
      orderBy: { createdAt: 'desc' }
    });
    res.json(projects);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch projects' });
  }
};

export const createProject = async (req, res) => {
  const { projectName, layoutJson, reactCode } = req.body;

  if (!projectName) {
    return res.status(400).json({ error: 'Project name required' });
  }

  try {
    const project = await prisma.project.create({
      data: {
        userId: req.userId,
        projectName,
        layoutJson: layoutJson || [],
        reactCode: reactCode || ''
      }
    });
    res.status(201).json(project);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create project' });
  }
};

export const getProject = async (req, res) => {
  const { id } = req.params;

  try {
    const project = await prisma.project.findUnique({
      where: { id }
    });

    if (!project || project.userId !== req.userId) {
      return res.status(403).json({ error: 'Not authorized' });
    }

    res.json(project);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch project' });
  }
};

export const updateProject = async (req, res) => {
  const { id } = req.params;
  const { projectName, layoutJson, reactCode } = req.body;

  try {
    const project = await prisma.project.findUnique({ where: { id } });

    if (!project || project.userId !== req.userId) {
      return res.status(403).json({ error: 'Not authorized' });
    }

    const updated = await prisma.project.update({
      where: { id },
      data: {
        projectName: projectName || project.projectName,
        layoutJson: layoutJson || project.layoutJson,
        reactCode: reactCode || project.reactCode
      }
    });

    res.json(updated);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update project' });
  }
};

export const deleteProject = async (req, res) => {
  const { id } = req.params;

  try {
    const project = await prisma.project.findUnique({ where: { id } });

    if (!project || project.userId !== req.userId) {
      return res.status(403).json({ error: 'Not authorized' });
    }

    await prisma.project.delete({ where: { id } });
    res.json({ message: 'Project deleted' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete project' });
  }
};
