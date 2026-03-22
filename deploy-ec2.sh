#!/bin/bash
set -e

RDS_SG="sg-0832e8cf81413f1ef"
EC2_SG="sg-09d8de9794f008b12"

echo "=== Step 1: Finding latest Amazon Linux 2023 AMI ==="
AMI=$(aws ec2 describe-images --owners amazon --filters "Name=name,Values=al2023-ami-2023*-x86_64" "Name=state,Values=available" --query 'sort_by(Images, &CreationDate)[-1].ImageId' --output text)
echo "AMI: $AMI"

echo "=== Step 3: Launching EC2 instance ==="
INSTANCE_ID=$(aws ec2 run-instances --image-id $AMI --count 1 --instance-type t3.micro --key-name greenswap-key --security-group-ids $EC2_SG --tag-specifications 'ResourceType=instance,Tags=[{Key=Name,Value=greenswap-backend}]' --query 'Instances[0].InstanceId' --output text)
echo "Instance ID: $INSTANCE_ID"

echo "=== Step 4: Allocating Elastic IP ==="
ALLOC_ID=$(aws ec2 allocate-address --domain vpc --query 'AllocationId' --output text)
aws ec2 associate-address --instance-id $INSTANCE_ID --allocation-id $ALLOC_ID
ELASTIC_IP=$(aws ec2 describe-addresses --allocation-ids $ALLOC_ID --query 'Addresses[0].PublicIp' --output text)

echo ""
echo "=============================="
echo "EC2 ELASTIC IP: $ELASTIC_IP"
echo "=============================="
echo "Wait ~1 min for the instance to boot, then SSH in with:"
echo "ssh -i greenswap-key.pem ec2-user@$ELASTIC_IP"
