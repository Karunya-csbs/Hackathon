import { PrismaClient } from '@prisma/client';
import { deployToNetlify } from '../services/deploymentService.js';

const prisma = new PrismaClient();

export const deployProject = async (req, res) => {
  const { projectId } = req.body;

  if (!projectId) {
    return res.status(400).json({ error: 'Project ID required' });
  }

  try {
    const project = await prisma.project.findUnique({
      where: { id: projectId }
    });

    if (!project || project.userId !== req.userId) {
      return res.status(403).json({ error: 'Not authorized' });
    }

    // Call deployment service
    const deploymentUrl = await deployToNetlify(project);

    // Save deployment record
    const deployment = await prisma.deployment.create({
      data: {
        projectId,
        netlifyUrl: deploymentUrl,
        deployStatus: 'success'
      }
    });

    res.json({
      message: 'Deployment successful',
      url: deploymentUrl,
      deployment
    });
  } catch (error) {
    console.error('Deployment error:', error);
    res.status(500).json({ error: 'Deployment failed' });
  }
};

export const getDeployments = async (req, res) => {
  const { projectId } = req.params;

  try {
    const project = await prisma.project.findUnique({
      where: { id: projectId }
    });

    if (!project || project.userId !== req.userId) {
      return res.status(403).json({ error: 'Not authorized' });
    }

    const deployments = await prisma.deployment.findMany({
      where: { projectId },
      orderBy: { deployedAt: 'desc' }
    });

    res.json(deployments);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch deployments' });
  }
};
