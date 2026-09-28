import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

export const PrereqTreeView = ({ node, onSelectCourse, depth = 0 }) => {
  if (!node) return null;

  return (
    <View style={[styles.container, { marginLeft: depth * 12 }]}>
      <TouchableOpacity
        style={[styles.nodeChip, node.isCycle && styles.cycleChip]}
        onPress={() => onSelectCourse(node.code)}
      >
        <Text style={styles.codeText}>{node.code}</Text>
        {node.isCycle && <Text style={styles.cycleBadge}>Cycle Detected</Text>}
      </TouchableOpacity>

      {node.children && node.children.length > 0 && (
        <View style={styles.childrenContainer}>
          {node.children.map((childNode, index) => (
            <PrereqTreeView
              key={`${childNode.code}-${index}`}
              node={childNode}
              onSelectCourse={onSelectCourse}
              depth={depth + 1}
            />
          ))}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 4,
    borderLeftWidth: 2,
    borderLeftColor: '#E2E8F0',
    paddingLeft: 8,
  },
  nodeChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#EDF2F7',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 6,
    alignSelf: 'flex-start',
  },
  cycleChip: {
    backgroundColor: '#FED7D7',
  },
  codeText: {
    fontWeight: '600',
    color: '#2D3748',
  },
  cycleBadge: {
    marginLeft: 6,
    fontSize: 10,
    color: '#C53030',
    fontWeight: 'bold',
  },
  childrenContainer: {
    marginTop: 4,
  },
});
