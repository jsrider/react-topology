import React from 'react';
import PropTypes from 'prop-types';
import Constants from '../constants';
import { getContentRect } from '../functions';
import GraphNodeTitle from './title';
import GraphNodeButton from './button';
import GraphNodeContent from './content';
import { GraphNodeRect, GraphShadowRect } from './shapes';

const GraphNode = ({
  nodeColor,
  nodeReversedColor,
  data,
  index,
  onDragStart,
  onNodeTitleClick,
  onQuickActions
}) => {
  const { left, top, width, height } = data.nodeRect;
  const {
    connections,
    id,
    children,
    instancesActive,
    isConsul,
    reversed
  } = data;
  const reverse = isConsul || reversed;

  let x = data.x;
  let y = data.y;

  if ((connections || []).length !== 0) {
    x = data.x + left;
    y = data.y + top;
  }

  const onButtonClick = evt => {
    const tooltipPosition = {
      x: data.x + Constants.buttonRect.x + Constants.buttonRect.width / 2,
      y: data.y + Constants.buttonRect.y + Constants.buttonRect.height
    };

    if ((connections || []).length !== 0) {
      tooltipPosition.x += left;
      tooltipPosition.y += top;
    }

    const d = {
      service: data,
      position: {
        left: tooltipPosition.x,
        top: tooltipPosition.y
      }
    };

    if (onQuickActions) onQuickActions(evt, d);
  };

  const onTitleClick = evt => onNodeTitleClick(evt, { service: data });
  const onStart = evt => {
    evt.preventDefault();
    onDragStart(evt, id);
  };

  const nodeRectEvents =
    (connections || []).length === 0
      ? {}
      : {
          onMouseDown: onStart,
          onTouchStart: onStart
        };

  const nodeContent = children ? (
    children.reduce(
      (acc, d, i) => {
        acc.children.push(
          <GraphNodeContent
            key={i}
            child
            data={d}
            index={i}
            y={acc.y}
            nodeColor={nodeColor}
            nodeReversedColor={nodeReversedColor}
          />
        );
        acc.y += getContentRect(d, true).height;
        return acc;
      },
      { y: Constants.contentRect.y, children: [] }
    ).children
  ) : (
    <GraphNodeContent
      nodeColor={nodeColor}
      nodeReversedColor={nodeReversedColor}
      data={data}
    />
  );

  const nodeShadow = instancesActive ? (
    <GraphShadowRect
      x={0}
      y={3}
      width={width}
      height={height}
      consul={reverse}
      active={instancesActive}
    />
  ) : null;

  return (
    <g transform={`translate(${x}, ${y})`}>
      {nodeShadow}
      <GraphNodeRect
        x={0}
        y={0}
        width={width}
        height={height}
        consul={reverse}
        active={instancesActive}
        connected={(connections || []).length !== 0}
        nodeColor={nodeColor}
        nodeReversedColor={nodeReversedColor}
        {...nodeRectEvents}
      />
      <GraphNodeTitle data={data} onNodeTitleClick={onTitleClick} />
      <GraphNodeButton
        index={index}
        onButtonClick={onButtonClick}
        isConsul={reverse}
        instancesActive={instancesActive}
      />
      {nodeContent}
    </g>
  );
};

GraphNode.propTypes = {
  data: PropTypes.object.isRequired,
  index: PropTypes.number.isRequired,
  onDragStart: PropTypes.func,
  onNodeTitleClick: PropTypes.func,
  onQuickActions: PropTypes.func,
  /** 
   * Color of each node
  */
  nodeColor: PropTypes.string,
  /** 
   * Color of each node when reversed
  */
  nodeReversedColor: PropTypes.string
};

export default GraphNode;
