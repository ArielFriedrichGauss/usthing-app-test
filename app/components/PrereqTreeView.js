import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

export const PrereqTreeView = ({ node, onSelectCourse, depth = 0 }) => {
  if (!node) return null;

  return (
    <View style={[styles.container, depth > 0 && styles.indentedContainer]}>
      <TouchableOpacity
        style={[styles.nodeChip, node.isCycle && styles.cycleChip]}
        activeOpacity={0.7}
        onPress={() => onSelectCourse(node.code)}
      >
        <Text style={[styles.codeText, node.isCycle && styles.cycleCodeText]}>
          {node.code}
        </Text>
        {node.isCycle ? (
          <Text style={styles.cycleBadge}>Cycle</Text>
        ) : (
          <Text style={styles.arrowIcon}> ></Text>
        )}
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
    marginVertical: 3,
  },
  indentedContainer: {
    marginLeft: 12,
    paddingLeft: 10,
    borderLeftWidth: 2,
    borderLeftColor: '#EFE3D3',
  },
  nodeChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F7EDE1',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
    alignSelf: 'flex-start',
    borderWidth: 1,
    borderColor: '#EFE3D3',
  },
  cycleChip: {
    backgroundColor: '#FDF2F2',
    borderColor: '#F8B4B4',
  },
  codeText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#6E4D25',
  },
  cycleCodeText: {
    color: '#9B1C1C',
  },
  cycleBadge: {
    marginLeft: 6,
    fontSize: 11,
    color: '#9B1C1C',
    fontWeight: 'bold',
  },
  arrowIcon: {
    fontSize: 14,
    color: '#8C7B6C',
    fontWeight: 'bold',
    marginLeft: 2,
  },
  childrenContainer: {
    marginTop: 2,
  },
});
