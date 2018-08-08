import cx from 'classnames';
import React, { Component } from 'react';

class UITreeNode extends Component {
  constructor(props) {
    super(props);
  }

  renderCollapse = () => {
    const { index } = this.props;

    if (index.children && index.children.length) {
      const { collapsed } = index.node;

      return (
        <span
          className={cx('collapse', collapsed ? 'caret-right' : 'caret-down')}
          onMouseDown={e => e.stopPropagation()}
          onClick={this.handleCollapse}
        />
      );
    }

    return null;
  };

  renderChildren = (options) => {
    const { index, tree, dragging } = this.props;

    if (index.children && index.children.length) {
      const childrenStyles = {
        paddingLeft: options && !isNaN(options.padding) ? 
          options.padding : this.props.paddingLeft
      };

      return (
        <div className="children" style={childrenStyles}>
          {index.children.map(child => {
            const childIndex = tree.getIndex(child);

            return (
              <UITreeNode
                tree={tree}
                index={childIndex}
                key={childIndex.id}
                dragging={dragging}
                paddingLeft={this.props.paddingLeft}
                onCollapse={this.props.onCollapse}
                onDragStart={this.props.onDragStart}
              />
            );
          })}
        </div>
      );
    }

    return null;
  };

  render() {
    const { tree, index, dragging } = this.props;
    const { node } = index;
    const styles = {};

    if (index.id == 1) {
      return this.renderChildren({padding: 0});
    }

    return (
      <div
        className={cx('m-node', {
          placeholder: index.id === dragging
        })}
        style={styles}
      >
        <div
          className="inner"
          onMouseDown={this.handleMouseDown}
        >
          {this.renderCollapse()}
          {tree.renderNode(node)}
        </div>
        {node.collapsed ? null : this.renderChildren()}
      </div>
    );
  }

  handleCollapse = e => {
    e.stopPropagation();
    const nodeId = this.props.index.id;

    if (this.props.onCollapse) {
      this.props.onCollapse(nodeId);
    }
  };

  handleMouseDown = e => {
    if (this.props.index.node.leaf) {
      return;
    }

    const nodeId = this.props.index.id;

    if (this.props.onDragStart) {
      this.props.onDragStart(nodeId, e);
    }
  };
}

module.exports = UITreeNode;
