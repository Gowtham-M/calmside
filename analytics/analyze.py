import pandas as pd
import matplotlib.pyplot as plt
import sys

def generate_sales_analysis(input_file, output_file):
    # Load data
    data = pd.read_csv(input_file)

    # Extract day and hour from timestamp
    data['date'] = pd.to_datetime(data['order_time'])
    data['day_of_week'] = data['date'].dt.day_name()
    data['hour_of_day'] = data['date'].dt.hour

    # Analyze sales by day and hour
    sales_by_day_hour = data.groupby(['day_of_week', 'hour_of_day']).size().unstack()

    # Plot sales analysis
    plt.figure(figsize=(12, 6))
    sales_by_day_hour.plot(kind='bar')
    plt.title('Sales Analysis by Day and Hour')
    plt.xlabel('Day of Week')
    plt.ylabel('Number of Sales')
    plt.savefig(output_file)  # Save the plot to a file

if __name__ == "__main__":
    input_file = sys.argv[1]
    output_file = sys.argv[2]
    generate_sales_analysis(input_file, output_file)
