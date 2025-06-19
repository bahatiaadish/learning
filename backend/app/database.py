from typing import Dict, List, Optional
from datetime import datetime, timedelta
from app.models import User, ContentTopic, ContentSection, UserProgress, SubscriptionTier, ContentLevel
import hashlib

class InMemoryDatabase:
    def __init__(self):
        self.users: Dict[int, User] = {}
        self.topics: Dict[int, ContentTopic] = {}
        self.sections: Dict[int, ContentSection] = {}
        self.user_progress: Dict[str, UserProgress] = {}
        self.user_counter = 1
        self.topic_counter = 1
        self.section_counter = 1
        
        self._initialize_sample_data()
    
    def _initialize_sample_data(self):
        topics_data = [
            {
                "title": "Network Protocols",
                "description": "Comprehensive guide to networking protocols including BGP, OSPF, and TCP/IP",
                "category": "Networking",
                "levels": [ContentLevel.NOVICE, ContentLevel.INTERMEDIATE, ContentLevel.ADVANCED, ContentLevel.PRO]
            },
            {
                "title": "Python Programming",
                "description": "Learn Python from basics to advanced concepts",
                "category": "Programming",
                "levels": [ContentLevel.NOVICE, ContentLevel.INTERMEDIATE, ContentLevel.ADVANCED]
            },
            {
                "title": "Cloud Computing",
                "description": "Master cloud technologies and deployment strategies",
                "category": "Cloud",
                "levels": [ContentLevel.NOVICE, ContentLevel.INTERMEDIATE, ContentLevel.ADVANCED, ContentLevel.PRO]
            },
            {
                "title": "Machine Learning",
                "description": "Understand ML algorithms and implementation",
                "category": "AI/ML",
                "levels": [ContentLevel.INTERMEDIATE, ContentLevel.ADVANCED, ContentLevel.PRO]
            }
        ]
        
        for topic_data in topics_data:
            topic = ContentTopic(
                id=self.topic_counter,
                **topic_data
            )
            self.topics[self.topic_counter] = topic
            self._create_sections_for_topic(self.topic_counter, topic_data["levels"])
            self.topic_counter += 1
    
    def _create_sections_for_topic(self, topic_id: int, levels: List[ContentLevel]):
        topic = self.topics[topic_id]
        
        sections_data = {
            ContentLevel.NOVICE: [
                f"Introduction to {topic.title}",
                f"Basic Concepts of {topic.title}",
                f"Getting Started with {topic.title}",
                f"Common Use Cases"
            ],
            ContentLevel.INTERMEDIATE: [
                f"Advanced {topic.title} Concepts",
                f"Best Practices and Patterns",
                f"Real-world Applications",
                f"Troubleshooting Common Issues"
            ],
            ContentLevel.ADVANCED: [
                f"Expert-level {topic.title}",
                f"Performance Optimization",
                f"Security Considerations",
                f"Integration Strategies"
            ],
            ContentLevel.PRO: [
                f"Professional {topic.title} Implementation",
                f"Enterprise Architecture",
                f"Scalability and Reliability",
                f"Industry Standards and Compliance"
            ]
        }
        
        for level in levels:
            for i, section_title in enumerate(sections_data[level]):
                content = self._generate_sample_content(topic.title, level, section_title)
                section = ContentSection(
                    id=self.section_counter,
                    topic_id=topic_id,
                    level=level,
                    title=section_title,
                    content=content,
                    order=i + 1
                )
                self.sections[self.section_counter] = section
                self.section_counter += 1
    
    def _generate_sample_content(self, topic: str, level: ContentLevel, title: str) -> str:
        base_content = f"""

This section covers {title.lower()} as part of our comprehensive {topic} curriculum at the {level.value} level.

- Understanding the fundamentals
- Practical applications
- Best practices and recommendations
- Common pitfalls to avoid

By the end of this section, you will be able to:
1. Understand the core concepts
2. Apply the knowledge in real scenarios
3. Troubleshoot common issues
4. Implement best practices

{self._get_level_specific_content(level, topic)}

This section provided an introduction to {title.lower()}. Continue to the next section to build upon these concepts.

1. What are the main benefits of this approach?
2. How would you implement this in a production environment?
3. What are the security considerations?

Use the AI assistant to get detailed explanations and ask specific questions about this content.
"""
        return base_content.strip()
    
    def _get_level_specific_content(self, level: ContentLevel, topic: str) -> str:
        if level == ContentLevel.NOVICE:
            return f"""
This is an introductory overview of {topic}. We'll start with the basics and build your understanding step by step.

- Simple explanations with examples
- Step-by-step guidance
- Visual aids and diagrams
- Hands-on exercises

1. Set up your environment
2. Follow along with examples
3. Practice with guided exercises
4. Ask questions using the AI assistant
"""
        elif level == ContentLevel.INTERMEDIATE:
            return f"""
Building on the fundamentals, this intermediate content explores more complex aspects of {topic}.

- Deeper technical details
- Real-world scenarios
- Performance considerations
- Integration patterns

- Industry use cases
- Implementation strategies
- Optimization techniques
- Monitoring and maintenance
"""
        elif level == ContentLevel.ADVANCED:
            return f"""
Advanced {topic} content for experienced practitioners looking to master complex implementations.

- Architecture design patterns
- Scalability considerations
- Security best practices
- Performance optimization

- Enterprise-grade solutions
- High-availability setups
- Disaster recovery planning
- Compliance requirements
"""
        else:  # PRO
            return f"""
Professional-level {topic} content for industry experts and architects.

- Large-scale implementations
- Multi-region deployments
- Vendor selection criteria
- Cost optimization strategies

- Emerging trends and technologies
- Strategic planning
- Team leadership
- Innovation frameworks
"""

db = InMemoryDatabase()
