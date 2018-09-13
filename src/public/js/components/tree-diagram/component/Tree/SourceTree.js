import React from 'react';

import { FILE_NODE_TYPE, DIR_NODE_TYPE } from 'utils/constants';
import { FileName } from 'components/tree-diagram/component/Node/File';
import { FolderName } from 'components/tree-diagram/component/Node/Folder';
import { Dot } from 'components/tree-diagram/component/Dot/';
import { SourceEdge } from 'components/tree-diagram/component/Edge/SourceEdge';

import DependenciesTree from './DependenciesTree';
import CodeCrumbsTree from './CodeCrumbsTree';

class SourceTree extends React.Component {
  render() {
    const {
      sourceDiagramOn,
      dependenciesDiagramOn,
      sourceDimFolders,
      codeCrumbsDiagramOn,

      filesTreeLayoutNodes,
      closedFolders,
      selectedNode,
      shiftToCenterPoint,
      onNodeTextClick,
      onFileIconClick,
      onFolderIconClick,
      dependenciesList
    } = this.props;

    const sourceEdges = [];
    const selectedSourceEdges = [];
    const sourceNodes = [];
    const sourceDotes = [];

    // TODO: add normal id generators for keys to not use i
    let i = 0;
    sourceDiagramOn &&
      filesTreeLayoutNodes.each(node => {
        i++;

        const [nX, nY] = [node.y, node.x];
        const position = shiftToCenterPoint(nX, nY);
        const { name, path } = node.data;

        const parent = node.parent;
        const selected = selectedNode && selectedNode.path.indexOf(path) !== -1;

        if (parent && parent.data.type === DIR_NODE_TYPE) {
          const [pX, pY] = [parent.y, parent.x];
          const sourcePosition = shiftToCenterPoint(pX, pY);

          const edge = (
            <SourceEdge
              key={`edge-${i}`}
              targetPosition={position}
              sourcePosition={sourcePosition}
              disabled={sourceDimFolders}
              singleChild={parent.children.length === 1}
              selected={selected}
            />
          );

          selected ? selectedSourceEdges.push(edge) : sourceEdges.push(edge);
        }

        const type = node.data.type;
        if (type === DIR_NODE_TYPE || (type === FILE_NODE_TYPE && !dependenciesDiagramOn)) {
          sourceDotes.push(
            <Dot key={`dot-${i}`} position={position} disabled={false} selected={selected} />
          );
        }

        let nodeBasedOnType = null;
        if (node.data.type === FILE_NODE_TYPE) {
          nodeBasedOnType = (
            <FileName
              position={position}
              name={name}
              purple={node.children}
              dependency={dependenciesDiagramOn}
              onTextClick={() => onNodeTextClick(node.data)}
              onIconClick={() => dependenciesDiagramOn && onFileIconClick(node.data)}
            />
          );
        } else if (node.data.type === DIR_NODE_TYPE) {
          nodeBasedOnType = (
            <FolderName
              position={position}
              name={name}
              dependency={dependenciesDiagramOn}
              disabled={sourceDimFolders}
              closed={closedFolders[node.data.path]}
              onTextClick={() => onNodeTextClick(node.data)}
              onIconClick={() => onFolderIconClick(node.data)}
            />
          );
        }

        sourceNodes.push(<React.Fragment key={name + i}>{nodeBasedOnType}</React.Fragment>);
      });

    return (
      <React.Fragment>
        {(sourceDiagramOn && sourceEdges) || null}
        {(sourceDiagramOn && selectedSourceEdges) || null}
        {(sourceDiagramOn && sourceDotes) || null}

        {dependenciesList && dependenciesDiagramOn && <DependenciesTree {...this.props} />}

        {(sourceDiagramOn && sourceNodes) || null}

        {(codeCrumbsDiagramOn && <CodeCrumbsTree {...this.props} />) || null}
      </React.Fragment>
    );
  }
}

export default SourceTree;