import React from 'react';
import {
  Page,
  Text,
  View,
  Document,
  StyleSheet,
  Font,
} from '@react-pdf/renderer';

import { COLUMN_NAMES } from '../constants';

Font.register({
  family: 'Open Sans',
  src: `https://fonts.gstatic.com/s/opensans/v17/mem8YaGs126MiZpBA-UFVZ0e.ttf`,
});

const styles = StyleSheet.create({
  page: {
    padding: 30,
    fontFamily: 'Open Sans',
    textAlign: 'center',
    fontSize: 12,
  },
  title: {
    fontSize: 15,
  },
  subtitle: {
    color: 'gray',
    marginBottom: 8,
  },
  partnerName: {
    marginTop: 8,
    marginBottom: 8,
  },
  item: {
    flexDirection: 'row',
    textAlign: 'left',
  },
  bulletPoint: {
    width: 12,
  },
  indentBullet: {
    width: 12,
    marginLeft: 12,
  },
  detailContainer: {
    textAlign: 'left',
    flexDirection: 'row',
  },
});

const Task = ({ children }) => {
  return (
    <View style={styles.item}>
      <Text style={styles.bulletPoint}>•</Text>
      <Text>{children}</Text>
    </View>
  );
};

const Standard = ({ children }) => {
  return (
    <View style={styles.item}>
      <Text style={styles.indentBullet}>•</Text>
      <Text>{children}</Text>
    </View>
  );
};

const List = ({ children }) => children;

const ResultsPDF = ({ name1, name2, tasks }) => {
  const { PRTNR_1, PRTNR_2 } = COLUMN_NAMES;

  const nextMeeting = new Date();
  nextMeeting.setDate(nextMeeting.getDate() + 7); // Week from today

  const renderTasksForPartner = (name, columnName) => (
    <View>
      <Text style={styles.partnerName}>{name}</Text>
      <List>
        {tasks
          .filter((task) => task.column === columnName)
          .map((task, i) => (
            <>
              <Task key={i} style={styles.detailContainer}>
                {task.name} {task.includes && '(' + task.includes + ')'}
              </Task>
              {task.standards &&
                task.standards.split('\n').map((s) => (
                  <Standard key={i} style={styles.detailContainer}>
                    {s}
                  </Standard>
                ))}
            </>
          ))}
      </List>
      <View />
    </View>
  );

  return (
    <Document>
      <Page size='A4' style={styles.page}>
        <Text style={styles.title}> Your Love Nest Cards </Text>
        <Text style={styles.subtitle}>
          Next feedback/re-sort meeting:
          {' ' + nextMeeting.toLocaleDateString()}
        </Text>
        {renderTasksForPartner(name1, PRTNR_1)}
        {renderTasksForPartner(name2, PRTNR_2)}
      </Page>
    </Document>
  );
};

export default ResultsPDF;
