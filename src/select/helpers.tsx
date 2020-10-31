import React, { useState } from "react";

interface ReturnsOptions {
  options: React.ReactElement[];
  activeNode: React.ReactElement;
}

/**
 * Utility function for add props in clone option
 *
 * @param {React.ReactElement} child - option
 * @param {{onClick: Function}} props - props for options
 * @returns {React.ReactElement} - element
 */
const addPropsForOption = (
  child: React.ReactElement,
  props: { onClick: Function }
): React.ReactElement => {
  return React.cloneElement(
    child,
    {
      ...props,
    },
    child.props.children
  );
};

/**
 * Get modified options and active node
 *
 * @param {React.ReactElement} child - option
 * @param {{onChange: Function}} props - props for option
 * @param {object | string} returnedValue - returned value in onChange handler
 * @returns {React.ReactElement[]} - list of options
 */
const getModifiedOptions = (
  child,
  { onChange, ...restProps },
  returnedValue
): { node: React.ReactElement; options: React.ReactElement[] } => {
  return addPropsForOption(child, {
    onClick: (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
      onChange(returnedValue)(e);
    },
    ...restProps,
  });
};

/**
 * Get modified groups with options and active node
 *
 * @param {React.ReactElement} child - group with options
 * @param {{onChange: Function, setGroup: Function, groupKey: number}} props - props for set group index, props for option
 * @param {number} index - index of group
 * @returns {{node: React.ReactElement, group: React.ReactElement}} - modified group with options and active node
 */
const getModifiedGroups = (
  child,
  { groupKey, setGroup, ...restProps },
  index
): { node: React.ReactElement; options: React.ReactElement[] } => {
  let activeNode = null;

  const childrenGroup = React.Children.map(
    child.props.children,
    (childGroup) => {
      if (childGroup.props.isActive) {
        activeNode = React.createElement("div", {}, childGroup.props.children);
      }
      return getModifiedOptions(childGroup, restProps, {
        value: childGroup.props.value,
        group: child.props.title,
      });
    }
  );
  return {
    node: activeNode,
    group: React.cloneElement(
      child,
      {
        onClick: () => setGroup(groupKey === index ? null : index),
        isOpen: groupKey === index,
      },
      [...childrenGroup]
    ),
  };
};

/**
 * Get options for select and activeNode
 *
 * @param {React.ReactElement[]} children - array of not prepare options
 * @param props
 * @param {{onChange: Function}} - props for option in array of options
 * @returns {ReturnsOptions} - prepared options and active option
 */
export const useGetOptions = (
  children: React.ReactElement[],
  props: { onChange: Function }
): ReturnsOptions => {
  const [groupKey, setGroup] = useState(null);
  let activeNode = null;
  return {
    options: React.Children.map(children, (child, index) => {
      if (Array.isArray(child.props.children)) {
        const { node, group } = getModifiedGroups(
          child,
          {
            ...props,
            groupKey,
            setGroup,
          },
          index
        );
        activeNode = node;
        return group;
      } else {
        if (child.props.isActive) {
          activeNode = React.createElement("div", {}, child.props.children);
        }
        return getModifiedOptions(child, props, { value: child.props.value });
      }
    }),
    activeNode,
  };
};
