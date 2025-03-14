// This file provides React compatibility for components that expect React
import * as preact from 'preact';
import * as hooks from 'preact/hooks';

// Create a React-like object
const React = {
  ...preact,
  createElement: preact.h,
  Fragment: preact.Fragment,
  // Add hooks
  useState: hooks.useState,
  useEffect: hooks.useEffect,
  useContext: hooks.useContext,
  useReducer: hooks.useReducer,
  useCallback: hooks.useCallback,
  useMemo: hooks.useMemo,
  useRef: hooks.useRef,
  // Additional React-like APIs
  Children: {
    map: (children, fn) => children && children.map(fn),
    forEach: (children, fn) => children && children.forEach(fn),
    count: (children) => children && children.length || 0,
    only: (children) => Array.isArray(children) ? (children.length === 1 ? children[0] : null) : children,
    toArray: (children) => Array.isArray(children) ? children : [children]
  }
};

export default React;
export const { useState, useEffect, useContext, useReducer, useCallback, useMemo, useRef } = hooks; 