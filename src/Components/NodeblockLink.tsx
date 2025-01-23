import React from 'react';
import githubMark from '../assets/github-mark.svg';
import './NodeblockLink.css';

const GITHUB_REPO = 'FCP-INDI/C-PAC';
const GITHUB_HASH = '61ad414447023daf0e401a81c92267b09c64ed94';

function getGithubUrl(filePath: string, lineNumber: number) {
  return `https://github.com/${GITHUB_REPO}/blob/${GITHUB_HASH}/${filePath}#L${lineNumber}`;
}

interface NodeblockLinkProps {
  nodeblockName: string;
  nodeblockData: any;
}

const NodeblockLink: React.FC<NodeblockLinkProps> = ({ nodeblockName, nodeblockData }) => {
  const nodeblock = nodeblockData?.find((block: any) => block.name === nodeblockName);
  if (!nodeblock) return null;

  const githubUrl = getGithubUrl(nodeblock.file, nodeblock.line_number);

  return (
    <a href={githubUrl} target="_blank" rel="noopener noreferrer">
      <img src={githubMark} alt="GitHub" width="32" height="32" className="github-icon" />
    </a>
  );
};

export default NodeblockLink;