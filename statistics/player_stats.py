# Stats to include: 
# Runs, Wicket Progression Chart as a function of Session
# 

import json
import os 
import copy
import numpy as np

def unique_elements(list1, list2):
    # Convert lists to sets to find unique elements
    set1 = set(list1)
    set2 = set(list2)
    
    # Find elements that are in set1 but not in set2
    unique_to_list1 = set1 - set2
    

    # Find elements that are in set2 but not in set1
    unique_to_list2 = set2 - set1
    
    # Combine the unique elements from both sets
    unique_elements = list(unique_to_list1) + list(unique_to_list2)
    
    return unique_elements


def run_avg(list1):

    length = len(list1)
    mn = np.zeros([1,length])

    for i in range (1,length+1):

        mn[0,i-1] = np.mean(list1[0:i])

    return mn


current_dir = os.path.dirname(os.path.abspath(__file__))
data_json_dir = os.path.join(current_dir, '..', 'data_json')


JSON_files = []

for root, dirs, files in os.walk(data_json_dir):
    for file in files:
        if file.lower().endswith('.json'):
            JSON_files.append(os.path.join(root, file))

print("\nCurrent dir: " + current_dir)
print("Data_json_dir: " + data_json_dir)
print("JSON_files: ")
print(JSON_files)

# DOES NOT ACCOUNT FOR 10 over limit! 
# DOES NOT ACCOUNT FOR INDIVIDUAL SWITCHING PER OVER!

names = ['Hritik', 'Rohit', 'Rahul']
outs = ['Bowled', 'C&B', 'Edged_Leg', 'Edged_Off', 'LBW', 'Box', 'Caught']
over = ['1','2','3','4','5','6']
runs_scored = 0
balls_bowled = 0


Template = {
    'Runs_Scored' : [],
    'Balls_Faced' : [],
    '6': 0,
    '4': 0,
    '3': 0,
    '2': 0,
    '1': 0,
    '0': 0,
    'Dismissal': [],
    'Runs_Conceded' : [],
    'Balls_Bowled' : [],
    'Wickets_Taken' : 0,
    'Wicket': [],
    'Catches': 0,
    'Maidens': 0,
    'Two_Wicket_Hauls': 0
    }


BIGMAN = {
"Hritik" : copy.deepcopy(Template),

"Rohit" : copy.deepcopy(Template),

"Rahul" : copy.deepcopy(Template)
}


Template2 = {
    'Runs_Conceded' : 0,
    'Balls_Bowled' : 0,
    'Wickets': 0
}

Temp_BIGMAN = {
"Hritik" : copy.deepcopy(Template2),

"Rohit" : copy.deepcopy(Template2),

"Rahul" : copy.deepcopy(Template2)
}

Reset_Temp = copy.deepcopy(Temp_BIGMAN)


for each_day in JSON_files:

    f = open(each_day)
    metadata = json.load(f)
    Data = metadata['Sheet1']
    # Closing file
    f.close()
    
    D = 0
    
    for each_over in Data:

        maiden = 0

        for each_delivery in over:           

            if each_over[str(each_delivery)] == 'Null':
                
                continue

            else:
                
                balls_bowled = balls_bowled + 1
                Temp_BIGMAN[each_over["Bowler Name"]]['Balls_Bowled'] += 1                                                  # How many balls are bowled

                if each_over[str(each_delivery)] == 0:
                    maiden += 1
                
                if isinstance(each_over[str(each_delivery)], int):
                    
                    runs_scored = runs_scored + each_over[str(each_delivery)]
                    BIGMAN[each_over["Batter Name"]][str(each_over[str(each_delivery)])] += 1                                   # Which runs they score

                    Temp_BIGMAN[each_over["Bowler Name"]]['Runs_Conceded'] += each_over[str(each_delivery)]                     # Which runs bowler concede

                elif "Runout" in each_over[str(each_delivery)]: 

                    runs_scored += int(each_over[str(each_delivery)][-1])
                    
                    BIGMAN[each_over["Batter Name"]]['Runs_Scored'].append(runs_scored)
                    BIGMAN[each_over["Batter Name"]][each_over[str(each_delivery)][-1]] += 1                                   # Which runs they score
                    BIGMAN[each_over["Batter Name"]]['Balls_Faced'].append(balls_bowled)
                    BIGMAN[each_over["Batter Name"]]['Dismissal'].append('Runout')

                    Temp_BIGMAN[each_over["Bowler Name"]]['Runs_Conceded'] += 1
                    BIGMAN[each_over["Bowler Name"]]['Wicket'].append('Runout')
                    BIGMAN[each_over["Bowler Name"]]['Wickets_Taken'] += 1
                    
                    runs_scored = 0
                    balls_bowled = 0

                    D += 1
                    
                elif each_over[str(each_delivery)] in outs:    
                    
                    BIGMAN[each_over["Batter Name"]]['Runs_Scored'].append(runs_scored)
                    BIGMAN[each_over["Batter Name"]]['Balls_Faced'].append(balls_bowled)
                    BIGMAN[each_over["Batter Name"]]['Dismissal'].append(each_over[str(each_delivery)])
                    
                    BIGMAN[each_over["Bowler Name"]]['Wickets_Taken'] += 1
                    Temp_BIGMAN[each_over["Bowler Name"]]['Wickets'] += 1

                    D += 1
                    runs_scored = 0
                    balls_bowled = 0
                    
                    if each_over[str(each_delivery)] == 'Caught':
                        BIGMAN[unique_elements(names, [each_over["Batter Name"],each_over["Bowler Name"]])[0]]['Catches'] += 1
                    elif each_over[str(each_delivery)] == 'C&B':
                        BIGMAN[each_over["Bowler Name"]]['Catches'] += 1

                    BIGMAN[each_over["Bowler Name"]]['Wicket'].append(each_over[str(each_delivery)])
                        

            if D == 3:

                BIGMAN['Hritik']['Runs_Conceded'].append(Temp_BIGMAN['Hritik']['Runs_Conceded'])
                BIGMAN['Rohit']['Runs_Conceded'].append(Temp_BIGMAN['Rohit']['Runs_Conceded'])
                BIGMAN['Rahul']['Runs_Conceded'].append(Temp_BIGMAN['Rahul']['Runs_Conceded'])

                BIGMAN['Hritik']['Balls_Bowled'].append(Temp_BIGMAN['Hritik']['Balls_Bowled'])
                BIGMAN['Rohit']['Balls_Bowled'].append(Temp_BIGMAN['Rohit']['Balls_Bowled'])
                BIGMAN['Rahul']['Balls_Bowled'].append(Temp_BIGMAN['Rahul']['Balls_Bowled'])

                if Temp_BIGMAN['Hritik']['Wickets'] == 2:
                    BIGMAN['Hritik']['Two_Wicket_Hauls'] += 1
                elif Temp_BIGMAN['Rohit']['Wickets'] == 2:
                    BIGMAN['Rohit']['Two_Wicket_Hauls'] += 1
                elif Temp_BIGMAN['Rahul']['Wickets'] == 2:
                    BIGMAN['Rahul']['Two_Wicket_Hauls'] += 1
                
                Temp_BIGMAN = copy.deepcopy(Reset_Temp)
                D = 0

        if maiden == 6:
            BIGMAN[each_over["Bowler Name"]]['Maidens'] += 1
        
#BIGMAN['Hritik']

import matplotlib.pyplot as plt
import numpy as np
import os
import copy

# Assume BIGMAN and run_avg are defined elsewhere

# List of subject names
subjects = ['Hritik', 'Rohit', 'Rahul']

# Ensure the "pictures" folder exists
folder = os.path.join(current_dir, 'pictures')
print("Pictures Folder: " + folder + "\n")

for name in subjects:
    # Create a deep copy of the subject
    Subject = copy.deepcopy(BIGMAN[name])

    # Generate x values based on the length of Runs_Scored
    x = np.linspace(1, len(Subject['Runs_Scored']), len(Subject['Runs_Scored']))

    # Compute the moving average
    mn = run_avg(Subject['Runs_Scored'])[0]

    # Create the plot
    plt.figure()  # Create a new figure for each subject
    plt.bar(x, Subject['Runs_Scored'])
    plt.plot(x, mn)
    plt.grid(1)
    plt.xlabel('X-axis Label')  # Add labels and title if needed
    plt.ylabel('Y-axis Label')
    plt.title(f'Performance of {name}')

    # Save the plot to a file
    filename = os.path.join(folder, f'average_runs_plot_{name}.png')
    print(filename)
    plt.savefig(filename)

    # Close the figure to avoid memory issues
    plt.close()

import matplotlib.pyplot as plt
from collections import Counter
import copy
import os

for name in subjects:
    # Create a deep copy of the subject
    Subject = copy.deepcopy(BIGMAN[name])
    
    # Plot and save Wickets Taken pie chart
    Var1 = Subject['Wicket']
    counter = Counter(Var1)
    labels, frequencies = zip(*counter.items())

    plt.figure()
    plt.pie(frequencies, labels=labels, autopct='%1.1f%%', startangle=140)
    plt.title(f'Wickets Taken - {name}')
    plt.axis('equal')  # Equal aspect ratio ensures the pie chart is circular.
    filename = os.path.join(folder, f'wickets_taken_chart_{name}.png')
    plt.savefig(filename)
    plt.close()  # Close the figure to free up memory

    # Plot and save Dismissal pie chart
    Var2 = Subject['Dismissal']
    counter = Counter(Var2)
    labels, frequencies = zip(*counter.items())

    plt.figure()
    plt.pie(frequencies, labels=labels, autopct='%1.1f%%', startangle=140)
    plt.title(f'Dismissal - {name}')
    plt.axis('equal')  # Equal aspect ratio ensures the pie chart is circular.
    filename = os.path.join(folder, f'dismissals_chart_{name}.png')
    plt.savefig(filename)
    plt.close()  # Close the figure to free up memory


import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
from pandas.plotting import table
import os

Title = ['Matches Played', 'Runs Scored', 'Balls Faced', 'Average', 'SR', 'Balls Average', 'Highest Score', '5s', '10s', '20s', 'Ducks', '4s', '6s', 'Golden Ducks']

DF1 = [len(BIGMAN['Hritik']['Runs_Scored']), np.sum(BIGMAN['Hritik']['Runs_Scored']), np.sum(BIGMAN['Hritik']['Balls_Faced']), np.sum(BIGMAN['Hritik']['Runs_Scored'])/len(BIGMAN['Hritik']['Runs_Scored']), 
      100*np.sum(BIGMAN['Hritik']['Runs_Scored'])/np.sum(BIGMAN['Hritik']['Balls_Faced']), np.sum(BIGMAN['Hritik']['Balls_Faced'])/len(BIGMAN['Hritik']['Runs_Scored']),
      np.max(BIGMAN['Hritik']['Runs_Scored']), np.sum(np.array(BIGMAN['Hritik']['Runs_Scored']) >= 5)-np.sum(np.array(BIGMAN['Hritik']['Runs_Scored']) >= 10), 
      np.sum(np.array(BIGMAN['Hritik']['Runs_Scored']) >= 10), np.sum(np.array(BIGMAN['Hritik']['Runs_Scored']) >= 20), np.sum(np.array(BIGMAN['Hritik']['Runs_Scored']) == 0), 
      BIGMAN['Hritik']['4'], BIGMAN['Hritik']['6'], sum(np.array(np.array(BIGMAN['Hritik']['Runs_Scored']) == 0) & np.array(np.array(BIGMAN['Hritik']['Balls_Faced']) == 1))]

DF2 = [len(BIGMAN['Rohit']['Runs_Scored']), np.sum(BIGMAN['Rohit']['Runs_Scored']), np.sum(BIGMAN['Rohit']['Balls_Faced']), np.sum(BIGMAN['Rohit']['Runs_Scored'])/len(BIGMAN['Rohit']['Runs_Scored']), 
      100*np.sum(BIGMAN['Rohit']['Runs_Scored'])/np.sum(BIGMAN['Rohit']['Balls_Faced']), np.sum(BIGMAN['Rohit']['Balls_Faced'])/len(BIGMAN['Rohit']['Runs_Scored']),
      np.max(BIGMAN['Rohit']['Runs_Scored']), np.sum(np.array(BIGMAN['Rohit']['Runs_Scored']) >= 5)-np.sum(np.array(BIGMAN['Rohit']['Runs_Scored']) >= 10), 
      np.sum(np.array(BIGMAN['Rohit']['Runs_Scored']) >= 10), np.sum(np.array(BIGMAN['Rohit']['Runs_Scored']) >= 20), np.sum(np.array(BIGMAN['Rohit']['Runs_Scored']) == 0), 
      BIGMAN['Rohit']['4'], BIGMAN['Rohit']['6'], np.sum(np.array(np.array(BIGMAN['Rohit']['Runs_Scored']) == 0) & np.array(np.array(BIGMAN['Rohit']['Balls_Faced']) == 1))]

DF3 = [len(BIGMAN['Rahul']['Runs_Scored']), np.sum(BIGMAN['Rahul']['Runs_Scored']), np.sum(BIGMAN['Rahul']['Balls_Faced']), np.sum(BIGMAN['Rahul']['Runs_Scored'])/len(BIGMAN['Rahul']['Runs_Scored']), 
      100*np.sum(BIGMAN['Rahul']['Runs_Scored'])/np.sum(BIGMAN['Rahul']['Balls_Faced']), np.sum(BIGMAN['Rahul']['Balls_Faced'])/len(BIGMAN['Rahul']['Runs_Scored']),
      np.max(BIGMAN['Rahul']['Runs_Scored']), np.sum(np.array(BIGMAN['Rahul']['Runs_Scored']) >= 5)-np.sum(np.array(BIGMAN['Rahul']['Runs_Scored']) >= 10), 
      np.sum(np.array(BIGMAN['Rahul']['Runs_Scored']) >= 10), np.sum(np.array(BIGMAN['Rahul']['Runs_Scored']) >= 20), np.sum(np.array(BIGMAN['Rahul']['Runs_Scored']) == 0), 
      BIGMAN['Rahul']['4'], BIGMAN['Rahul']['6'], np.sum(np.array(np.array(BIGMAN['Rahul']['Runs_Scored']) == 0) & np.array(np.array(BIGMAN['Rahul']['Balls_Faced']) == 1))]

data = {
    'Stuffs': Title,
    'Hritik': DF1,
    'Rohit': DF2,
    'Rahul': DF3
}

# Creating the DataFrame
df = pd.DataFrame(data).round(2)

# Save the DataFrame as an image
fig, ax = plt.subplots(figsize=(10, 4))  # Set the size of the figure
ax.axis('tight')
ax.axis('off')

# Create a table plot
tbl = table(ax, df, loc='center', cellLoc='center', colWidths=[0.15] * len(df.columns))

# Adjust the table style to make it look more like the print output
tbl.auto_set_font_size(False)
tbl.set_fontsize(10)
tbl.scale(1.2, 1.2)

# Save the figure
plt.savefig(os.path.join(folder, "batting_summary.png"), bbox_inches='tight')

Title = ['Matches Played', 'Wickets Taken', 'Balls Bowled', 'Runs Conceded', 'Bowling Average', 'SR', '2 fers', 'Maidens', 'Economy']

DF1 = [len(BIGMAN['Hritik']['Balls_Bowled']), BIGMAN['Hritik']['Wickets_Taken'], np.sum(BIGMAN['Hritik']['Balls_Bowled']), np.sum(BIGMAN['Hritik']['Runs_Conceded']),
       np.sum(BIGMAN['Hritik']['Runs_Conceded'])/BIGMAN['Hritik']['Wickets_Taken'], np.sum(BIGMAN['Hritik']['Balls_Bowled'])/BIGMAN['Hritik']['Wickets_Taken'], 
       BIGMAN['Hritik']['Two_Wicket_Hauls'], BIGMAN['Hritik']['Maidens'], np.sum(BIGMAN['Hritik']['Runs_Conceded'])/np.sum(BIGMAN['Hritik']['Balls_Bowled'])*6]

DF2 = [len(BIGMAN['Rohit']['Balls_Bowled']), BIGMAN['Rohit']['Wickets_Taken'], np.sum(BIGMAN['Rohit']['Balls_Bowled']), np.sum(BIGMAN['Rohit']['Runs_Conceded']),
       np.sum(BIGMAN['Rohit']['Runs_Conceded'])/BIGMAN['Rohit']['Wickets_Taken'], np.sum(BIGMAN['Rohit']['Balls_Bowled'])/BIGMAN['Rohit']['Wickets_Taken'], 
       BIGMAN['Rohit']['Two_Wicket_Hauls'], BIGMAN['Rohit']['Maidens'], np.sum(BIGMAN['Rohit']['Runs_Conceded'])/np.sum(BIGMAN['Rohit']['Balls_Bowled'])*6]

DF3 = [len(BIGMAN['Rahul']['Balls_Bowled']), BIGMAN['Rahul']['Wickets_Taken'], np.sum(BIGMAN['Rahul']['Balls_Bowled']), np.sum(BIGMAN['Rahul']['Runs_Conceded']),
       np.sum(BIGMAN['Rahul']['Runs_Conceded'])/BIGMAN['Rahul']['Wickets_Taken'], np.sum(BIGMAN['Rahul']['Balls_Bowled'])/BIGMAN['Rahul']['Wickets_Taken'], 
       BIGMAN['Rahul']['Two_Wicket_Hauls'], BIGMAN['Rahul']['Maidens'], np.sum(BIGMAN['Rahul']['Runs_Conceded'])/np.sum(BIGMAN['Rahul']['Balls_Bowled'])*6]

data = {
    'Stuffs': Title,
    'Hritik': DF1,
    'Rohit': DF2,
    'Rahul': DF3
}

# Creating the DataFrame
df = pd.DataFrame(data).round(2)

# Save the DataFrame as an image
fig, ax = plt.subplots(figsize=(10, 4))  # Set the size of the figure
ax.axis('tight')
ax.axis('off')

# Create a table plot
tbl = table(ax, df, loc='center', cellLoc='center', colWidths=[0.15] * len(df.columns))

# Adjust the table style to make it look more like the print output
tbl.auto_set_font_size(False)
tbl.set_fontsize(10)
tbl.scale(1.2, 1.2)

# Save the figure
plt.savefig(os.path.join(folder, "bowling_summary.png"), bbox_inches='tight')




